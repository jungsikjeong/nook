import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AppLogger,
  ReqContext,
  RequestContext,
} from '@nook/nest-common';
import {
  InjectOidcProvider,
  InteractionHelper,
  OidcInteraction,
  Provider,
} from 'nest-oidc-provider';
import { LoginDto } from '../../auth/dto/login.dto';
import { AuthService } from '../../auth/auth.service';

@Controller('/interaction')
export class InteractionController {
  constructor(
    @InjectOidcProvider() private readonly provider: Provider,
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(InteractionController.name);
  }

  @Get(':uid')
  async getInteraction(@OidcInteraction() interaction: InteractionHelper) {
    const { prompt, params, uid } = await interaction.details();

    const client = await this.provider.Client.find(params.client_id as string);

    return {
      uid,
      prompt: {
        name: prompt.name,
        details: prompt.details,
      },
      params,
      client: client && {
        clientId: client.clientId,
        clientName: client.clientName,
      },
    };
  }

  @Post(':uid')
  async loginCheck(
    @ReqContext() ctx: RequestContext,
    @OidcInteraction() interaction: InteractionHelper,
    @Body() form: LoginDto,
  ) {
    const { prompt, params, uid } = await interaction.details();

    if (prompt.name !== 'login') {
      throw new BadRequestException('invalid prompt name');
    }

    let user;
    try {
      user = await this.authService.authenticate(form.email, form.password);
    } catch {
      this.logger.warn(ctx, `login failed for email=${form.email} uid=${uid}`);
      throw new UnauthorizedException('invalid credentials');
    }

    this.logger.log(ctx, `login success`, {
      uid,
      userId: user.id,
      clientId: params.client_id,
    });

    await interaction.finished(
      {
        login: {
          accountId: user.id,
          remember: form.remember ?? false,
        },
      },
      { mergeWithLastSubmission: false },
    );
  }

  @Post(':uid/confirm')
  async confirmLogin(@OidcInteraction() interaction: InteractionHelper) {
    const { prompt, params, session, grantId } = await interaction.details();

    if (!session?.accountId) {
      throw new BadRequestException('session not found');
    }

    const existingGrant = grantId
      ? await this.provider.Grant.find(grantId)
      : undefined;

    const grant =
      existingGrant ??
      new this.provider.Grant({
        accountId: session.accountId,
        clientId: params.client_id as string,
      });

    if (prompt.details.missingOIDCScope) {
      const scopes = prompt.details.missingOIDCScope as string[];
      grant.addOIDCScope(scopes.join(' '));
    }

    if (prompt.details.missingOIDCClaims) {
      grant.addOIDCClaims(prompt.details.missingOIDCClaims as string[]);
    }

    if (prompt.details.missingResourceScopes) {
      for (const [indicator, scopes] of Object.entries(
        prompt.details.missingResourceScopes,
      )) {
        grant.addResourceScope(indicator, scopes.join(' '));
      }
    }

    const newGrantId = await grant.save();

    await interaction.finished(
      { consent: { grantId: newGrantId } },
      { mergeWithLastSubmission: true },
    );
  }

  @Get(':uid/abort')
  async abortLogin(@OidcInteraction() interaction: InteractionHelper) {
    const result = {
      error: 'access_denied',
      error_description: 'End-user aborted interaction',
    };

    await interaction.finished(result, { mergeWithLastSubmission: false });
  }
}

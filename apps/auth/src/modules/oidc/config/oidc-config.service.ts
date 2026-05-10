import { Injectable } from '@nestjs/common';
import {
  AdapterFactory,
  OidcConfiguration,
  OidcModuleOptions,
  OidcModuleOptionsFactory,
} from 'nest-oidc-provider';
import { UsersService } from '../../users/users.service';
import { OidcAdapter } from '../adapters/oidc.adapter';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class OidcConfigService implements OidcModuleOptionsFactory {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  createModuleOptions(): OidcModuleOptions | Promise<OidcModuleOptions> {
    return {
      issuer: 'http://localhost:3001',
      path: '/oidc',
      oidc: this.getConfiguration(),
    };
  }

  createAdapterFactory(): AdapterFactory | Promise<AdapterFactory> {
    return (modelName: string) => new OidcAdapter(modelName, this.dbService);
  }

  getConfiguration(): OidcConfiguration {
    const usersService = this.usersService;
    return {
      findAccount: async (_ctx, id) => {
        const user = await usersService.findById(id);
        if (!user) return undefined;
        return {
          accountId: id,
          claims: async () => ({
            sub: id,
            email: user.email,
            email_verified: user.emailVerified,
            name: user.name ?? undefined,
          }),
        };
      },
      clients: [
        {
          client_id: 'test',
          client_name: 'test',
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          redirect_uris: ['http://localhost:3001/callback'],
          post_logout_redirect_uris: ['http://localhost:3001/logged-out'],
        },
      ],
      pkce: {
        methods: ['S256'],
        required: () => false,
      },
      scopes: [
        'openid',
        'offline_access',
        'profile',
        'email',
        'phone',
        'address',
      ],
      ttl: {
        AccessToken: 60 * 60,            // 1시간
        AuthorizationCode: 60,           // 60초
        IdToken: 60 * 60,                // 1시간
        RefreshToken: 60 * 60 * 24 * 14, // 14일
        Interaction: 60 * 60,            // 1시간 (사용자가 로그인 폼 머무를 시간)
        Session: 60 * 60 * 24 * 14,      // 14일
        Grant: 60 * 60 * 24 * 14,        // 14일
      },
      rotateRefreshToken: true,          // 매 갱신마다 새 refresh token 발급 (재사용 감지)
      features: {
        devInteractions: {
          enabled: false,
        },
        revocation: {
          enabled: true,                 // RFC 7009 — /oidc/token/revocation
        },
        introspection: {
          enabled: true,                 // RFC 7662 — /oidc/token/introspection
        },
        rpInitiatedLogout: {
          enabled: true,                 // /oidc/session/end (사용자 로그아웃 진입점)
          logoutSource: async (ctx, form) => {
            // 확인 화면 없이 즉시 로그아웃 진행 (auth-web으로 분리하려면 여기에 redirect)
            ctx.body = `<!DOCTYPE html><html><body>${form}<script>document.forms[0].submit()</script></body></html>`;
          },
          postLogoutSuccessSource: async (ctx) => {
            // post_logout_redirect_uri 가 없을 때만 호출됨
            ctx.body = '<!DOCTYPE html><html><body>Logged out</body></html>';
          },
        },
      },
      interactions: {
        url(_, interaction) {
          return `/interaction/${interaction.uid}`;
        },
      },
      cookies: {
        keys: [
          'gQMQym96H64-QInq7mvVX0nZEw0qUmcTA3bCpfnuR1h3YXNhgGJ0XLd17obmV8Gm',
        ],
        // @types/oidc-provider 가 maxAge 를 누락해서 캐스팅 — 런타임은 정상 처리
        long: { maxAge: 1000 * 60 * 60 * 24 * 30 } as any,    // 30일 — Remember Me
        short: { maxAge: 1000 * 60 * 10 } as any,             // 10분 — interaction 등 단명
      },
      jwks: {
        keys: [
          {
            kty: 'RSA',
            kid: 'UWXekTvfWi6o3wfYL9Wbd4f819MKevyQ0V4ksVn_YR0',
            use: 'sig',
            alg: 'RS256',
            e: 'AQAB',
            n: 'oyyqyR4rqOVxj6BhnhETZ3mQclECY4w7dMLzOdU9L514JtSmXFfsbL7sLC-Y6y88mTK7JZs073HMYgTJZqIBThxjl_F-TRoO5Svi488GsCk5osgP9xQul-4yx1gfqeQhQZdxo73R0EjO_kZR_i85AAz-O0BvUNiayeYUU23pNU_Q_fIZ-IWRSD15JeNNuROVkjpR8ocpEtOVsb3x0PpCzpkxXb7gh8HYpCHaJEj2k8mJstuOfLOm-eIHcrUv7uEYzSWSK6tfFNFsdwmHioRlY2-ASuvxq9Xqplz9-K5tW3dYE3B3wNIPdYPOAhpSwsD7dlwfM_lj269QULfsYDKnRQ',
            d: 'j-S24s5BUBqtryuOifai9u_jqnu3sJOcZtX36TsbTt79cri5z9sVObyPxlNe9Z7dQHfVQ0-AOdtPkeyIsoIQxpIQXZBvgYyGMCAoYB5T1os0MVFditR4VjCPBO24Vng_v3jOlMeyu4tJRkA60_1OtbW_h_7FazToIz1LFVtqeUB15ZczdjejAj4zQWTdLDyfL1Ez2d_KISq83q4XcwI3kgAsjCvkYAzR42jnrJB3W9tR1X9AYI6bsb1LVZCHlvAGJf6zrPTNhBz2owcs7YGPMwnxRLO0JZ__lr-f513Q9YkuBzCf14YhFBNkUGzH-52tcFZRfy50e9NaG-u-BU3wTQ',
            p: '0_HqVVfKJ1BXYnuOWMEd4eC8nS4Og-CZwi8nvKR3FqRKFSiST6Q0PIi1JQXi4SviIyvEdyUXc_aP8KrgjP8ervW6XiYmT1UKwMkhauIiCpOw7MsCMzt0Ol_EOgAXiCupMny0-NPEqzKx3e-64cvQq3V0hZnM-l0rHVKnABBfnu8',
            q: 'xRePZvrTSLhlI_7uq6LWRsYrz5afPq18DZNuxTg8Dp-PzVZNFxIV1EYB370BJYhaJ7d81vaWsTFtrj89cK9hnOtMqr_slo0YSGBk10PX5mPaG_Wlx_u7V8BUguVTiq320kVRXwqCYRNB4YaYpvbQ8j345fmogAETQgZ6hCZGXQs',
            dp: 'yrmUaPlF1YDVdM-2AlMFoC50euu42o-UwtaT7a5qcm_GpKJgAGmRxW0Fx1nv_20YKogMreH-ot7uI0du7a6AzN0h3DglYLB5TpmTq0aNRQyrqHMtsY9mxwcfDFNWLtuERVRfTbpRXWdqFlzdpmhrOfVo9Pl9xOQk_zE1p6wBqmU',
            dq: 'SLesnR4mHkqKZoGEpabq0CoFuA2mq4Vuo8OltvZMkkik0enpf32YuD0sK9ScO7DXMpgsY1OPvciy4vtKO-05YqAeJVGyhMmCEBIgopvRaJumuXIkvGhQcsvvYmwiKqSM0H_qydoiyJZGVGNIpzGhXf8nehJm7PN4m3-wbFmC1Ik',
            qi: 'Wr4sxOqITkM1VrlwUGe9S3q8lbQJD1_nVM-x862jckuRuhtfq5HooOcJs2eVxEZLvwxnKvuMCtrrdkeQt6ORdGXjU2xNMzBV2ohvksh4nd-dAbt1k4sz_h-6SOfWOzQz3f9x6aRQabvwUfUR3TmnrZWNmgXO7b9RJEWYB6K8aWo',
          },
        ],
      },
    };
  }
}

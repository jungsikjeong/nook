// apps/nook/backend/src/database/schema/auth.ts (예시)

export const user = pgTable('user', {
id: uuid('id').defaultRandom().primaryKey(),

    // IdP가 발급한 sub. 이게 IdP <-> nook 매핑의 유일한 영구 키.
    // 사용자가 IdP에서 이메일 바꿔도 sub는 안 바뀐다.
    idpSub: text('idp_sub').notNull().unique(),

    // IdP에서 받아온 캐시. 자동 동기화 대상.
    email: text('email').notNull(),
    name: text('name'),
    image: text('image'),
    emailVerified: boolean('email_verified').default(false),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

});

export const session = pgTable('session', {
id: uuid('id').defaultRandom().primaryKey(),
userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
expiresAt: timestamp('expires_at').notNull(),

    // IdP가 발급한 토큰들. nook이 IdP에 호출할 때 / 토큰 갱신할 때 사용.
    // 평문 보관은 위험 — 운영에선 encrypted-at-rest 권장.
    idpAccessToken: text('idp_access_token').notNull(),
    idpRefreshToken: text('idp_refresh_token'),
    idpIdToken: text('idp_id_token'),  // RP-initiated logout(end_session) 시 필요
    idpAccessTokenExpiresAt: timestamp('idp_access_token_expires_at'),

    createdAt: timestamp('created_at').notNull().defaultNow(),

});

// nook 비즈니스 데이터는 nook의 user.id 를 FK 로 참조
export const post = pgTable('post', {
id: uuid('id').defaultRandom().primaryKey(),
authorId: uuid('author_id').notNull().references(() => user.id),
// ...
});

핵심 포인트:

- idpSub (= IdP의 sub) 이 두 시스템을 잇는 유일한 키
- nook의 user.id는 nook 내부에서만 의미 있는 자체 ID
- 다른 비즈니스 테이블(post 등)은 nook user.id를 참조 (IdP sub 직접 참조 안 함)
- 토큰 3종은 세션 테이블에 보관

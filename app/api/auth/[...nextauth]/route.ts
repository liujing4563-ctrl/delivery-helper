export function generateStaticParams() {
  return [{ nextauth: ['index'] }];
}

function authDisabledResponse() {
  return Response.json(
    {
      error: 'MVP 阶段暂不启用真实账号系统，核心功能无需登录。',
    },
    { status: 501 }
  );
}

export const GET = authDisabledResponse;
export const POST = authDisabledResponse;

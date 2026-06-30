import { socialLoginAction } from "@/actions/auth";

interface SocialLoginProps {
  nextPath?: string;
}

export function SocialLogin({ nextPath = "/dashboard" }: SocialLoginProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-stone-200" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
          ou continue com
        </span>
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <form action={socialLoginAction}>
          <input type="hidden" name="provider" value="google" />
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
          >
            <span className="grid size-5 place-items-center rounded-full bg-white font-bold text-[#4285f4]" aria-hidden="true">
              G
            </span>
            Google
          </button>
        </form>

        <form action={socialLoginAction}>
          <input type="hidden" name="provider" value="github" />
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
          >
            <span className="grid size-5 place-items-center rounded-full bg-stone-900 text-[0.62rem] font-bold text-white" aria-hidden="true">
              GH
            </span>
            GitHub
          </button>
        </form>
      </div>
    </div>
  );
}

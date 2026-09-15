export const getRegisterInputClass = (hasError: boolean): string =>
  `w-full rounded-[14px] border bg-[#fffdf8] px-4 py-3 text-sm text-[#11233f] outline-none transition placeholder:text-[#6c7280]/70 focus:border-[#11233f] focus:ring-3 focus:ring-[#11233f]/15 disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError ? 'border-[#b84a2a]' : 'border-[#111927]/15'
  }`;

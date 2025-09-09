<script>
	import { Input } from '$lib/components/ui/input';
	import searchIcon from '$lib/assets/icons/search-normal.svg';
	import mic from '$lib/assets/icons/mic.svg';
	import pdf from '$lib/assets/icons/file-pdf.svg';
</script>

<div
	class="bg-gradient-to-b p-10 rounded-[20px] from-[#928bb8] via-[#ebdef8] to-[#FFFFFF] text-center font-mulish text-white relative"
>
	<div
		class="absolute top-7 right-5 cursor-pointer bg-white h-[35px] w-[35px] flex items-center justify-center text-[18px] rounded-full text-[#1E1E1E]"
	>
		X
	</div>
	<h1 class="font-bold text-[24px] text-white">
		Welcome to <span class="bg-white p-2 px-3 rounded-[100px] font-bold text-[20px]">
			<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
				>RafikiX</span
			>
		</span>
		, your personal AI Career Assistant
	</h1>
	<p class="text-[12px] font-bold mt-3 w-[80%] mx-auto">
		RafikiX helps you explore opportunities, gain clarity, and build confidence at every stage of
		your career. <a href="/career-guide" class="underline">Learn more about RafikiX policy here.</a>
	</p>

	<div class="bg-white p-10 py-15 shadow-md rounded-[20px] my-10">
		<div class="border border-[#E8E8E8] rounded-[100px] flex px-4 py-2">
			<img src={searchIcon} alt="Search Icon" width="20" height="20" />
			<Input
				type="text"
				placeholder="Ask a question to explore career options"
				class="w-full border-none outline-none focus-visible:ring-transparent placeholder:text-[14px] placeholder:font-bold placeholder:text-[#80899A] text-black shadow-none"
			/>
		</div>
		<div class="mt-5 flex gap-5">
			<button class="shadow-md rounded-[100px] flex items-center gap-2 px-4 py-3 w-fit">
				<img src={mic} alt="mic" width="20" height="20" />
				<p class="text-[14px] font-bold text-[#1E1E1E]">Voice Note</p>
			</button>
			<button class="shadow-md rounded-[100px] flex items-center gap-2 px-4 py-3 w-fit">
				<img src={mic} alt="mic" width="20" height="20" />
				<p class="text-[14px] font-bold text-[#1E1E1E]">Write a Story</p>
			</button>
			<button class="shadow-md rounded-[100px] flex items-center gap-2 px-4 py-3 w-fit">
				<img src={pdf} alt="mic" width="20" height="20" />
				<p class="text-[14px] font-bold text-[#1E1E1E]">Career Chat</p>
			</button>
			<button class="shadow-md rounded-[100px] flex items-center gap-2 px-4 py-3 w-fit">
				<img src={mic} alt="mic" width="20" height="20" />
				<p class="text-[14px] font-bold text-[#1E1E1E]">Interview Prep</p>
			</button>
		</div>
	</div>

	<p class="text-[14px] font-bold text-[#686868]">
		By messaging RafikiX, you agree to our
		<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
			>Terms and Conditions</span
		>
	</p>
</div>

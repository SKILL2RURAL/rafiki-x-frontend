<script lang="ts">
    import upload from '$lib/assets/icons/upload.png';
	import Input from '$lib/components/ui/input/input.svelte';
    export let onUpload: (files: FileList) => void;

    function handleFileChange(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            onUpload(files);
        }
    }
</script>

<div class="md:w-[677px] md:h-[337px] rounded-[20px] p-6 text-center bg-white flex flex-col items-center shadow-[0_4px_8px_4px_rgba(112,144,176,0.1)]">
    <div class="md:w-[611px] md:h-[190px] rounded-[6px] bg-[#F7FBFD] font-satoshi-regular space-y-6 pt-5">
        <img src={upload} alt="Upload Icon" class="mx-auto mb-4" width="59.05" height="51.15" />
        <p class="text-[13.73px] font-bold leading-5">Drag and drop files or 
            <label class="text-[#60269E] underline cursor-pointer">
                 Browse
                <input type="file" class="hidden" on:change={handleFileChange} />
            </label>
        </p>
        <p class="mt-2 text-[11.3px] text-[#676767] leading-4">Supported formats: PDF, TXT, PNG</p>
    </div>
    
    <div class="flex items-center gap-1 mt-6">
        <span class="md:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
        <p class="text-[14px]">OR</p>
        <span class="md:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
    </div>

    <div class="mt-4">
        <Input type="text" placeholder="Add text Content" class="md:w-[611px] h-[48px] rounded-[8px] border p-2.5 bg-[#F7FBFD] text-center" />
    </div>
</div>
<script lang="ts">
    import upload from '$lib/assets/icons/upload.png';
    import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
    import downloadIcon from '$lib/assets/icons/downloadIcon.png';
    import threeDot from '$lib/assets/icons/threeDot.png'
	

    let { onUpload, openEditor, files} : {
        onUpload: (files: FileList) => void,
        openEditor: boolean,
        files: Array<{name:string, size: string, type: string, icon?: string}>
    } = $props()

    function handleFileChange(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            onUpload(files);
            console.log(files);
        }
    }

    function handleAddText () {
        openEditor ? false : true;
    }

</script>

<div class="md:w-[677px] rounded-[20px] p-6 bg-white flex flex-col items-center shadow-[0_4px_8px_4px_rgba(112,144,176,0.1)]">
    <div class="md:w-[611px] md:h-[190px] rounded-[6px] bg-[#F7FBFD] font-satoshi-regular space-y-6 pt-5 text-center">
        <img src={upload} alt="Upload Icon" class="mx-auto mb-4" width="59.05" height="51.15" />
        <p class="text-[13.73px] font-bold leading-5">Drag and drop files or 
            <label class="text-[#60269E] underline cursor-pointer">
                 Browse
                <input type="file"  class="hidden" onchange={handleFileChange} />
            </label>
        </p>
        <p class="mt-2 text-[11.3px] text-[#676767] leading-4">Supported formats: PDF, TXT, PNG</p>
    </div>
    
    <div class="flex items-center gap-1 mt-6">
        <span class="md:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
        <p class="text-[14px]">OR</p>
        <span class="md:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
    </div>



    <Button class="md:w-[611px] h-[48px] rounded-[8px] border p-2.5 bg-[#F7FBFD] text-black mt-4" onclick={handleAddText}>Add text Content</Button>

    <ul class="flex flex-col gap-4 mt-6">
        {#each files as file}
            <li>
                <div class="md:w-[611px] h-[60px] flex justify-between rounded-[8px] bg-[#F7FBFD] p-3 font-satoshi-regular">
                    <div class="flex gap-2 items-center">
                        <img src={file.icon} alt="File Icon" class="" width="32" height="32"/>
                        <div>
                            <p class="text-[14px] font-medium leading-5">{file.name}</p>
                            <p class="text-[12px] text-[#4D5154] leading-4">{file.size}</p>
                        </div>
                    </div>
                    <div class="flex gap-2.5 items-center">
                        <div class="bg-gradient h-[17px] w-[66px] rounded-full text-white font-satoshi-regular font-medium text-[12px] text-center ">Default</div>
                        <div class="flex gap-2.5 items-center">
                            <img src={downloadIcon} alt="download icon" width="24" height="24"/>
                            <span class="w-[1px] h-[25px] bg-[#D9D9D9]"></span>
                            <img src={threeDot} alt="more icon" width="24" height="24"/>
                        </div>
                    </div>
                </div>
            </li>
        {/each}
    </ul>
</div>
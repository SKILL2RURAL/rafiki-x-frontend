<script lang="ts">
    import ResumeUploader from "./ResumeUploader.svelte";

    let { files, onUpload, openEditor }: {
        files: Array<{name: string, size: String, type: string}>,
        onUpload: (files: FileList) => void,
        openEditor: boolean
      } = $props()

</script>

<div>
    <ResumeUploader {onUpload} {openEditor}/>
    <ul class="flex flex-col gap-4 mt-6">
        {#each files as file}
            <li>
                <div class="md:w-[611px] h-[60px] rounded-[8px] bg-[#C8CCD0] p-3 font-satoshi-regular">
                    <p class="text-[14px] font-medium leading-5">{file.name}</p>
                    <p class="text-[12px] text-[#4D5154] leading-4">{file.size}</p>
                </div>
                <div>
                    <!-- Button placeholder -->
                </div>
            </li>
        {/each}
    </ul>
</div>

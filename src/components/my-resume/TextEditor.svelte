<script>
  let text = $state('Lorem ipsum...'); // Your lorem ipsum content
</script>

<div class="flex flex-col">
    <div class="mx-auto">
        <textarea bind:value={text} class="w-[475px] h-[500px] py-2.5 px-4 border rounded font-mulish text-[18px] leading-6" placeholder="Enter text here..."></textarea>
    </div>
    <div class="flex justify-end items-center gap-3">
        <button class="h-[56px] w-[185px] rounded-[8px] p-4 border border-gradient text-gradient font-satoshi-regular">Go Back</button>
        <button class="h-[56px] w-[185px] rounded-[8px] p-4 bg-gradient text-white font-satoshi-regular mr-3">Save</button>
    </div>
</div>

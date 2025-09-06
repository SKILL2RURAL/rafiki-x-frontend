<script>
    import threeDot from '$lib/assets/icons/threeDot.png';
    import { history } from '$lib'

</script>


<div class="p-5 font-satoshi-regular">
    {#each history as history}
        <div>
            <h1 class="text-[14px] font-medium leading-6 text-[#808990]">{history.day}</h1>
            <ul>
                {#each history.subject as subject}
                    <li class="flex justify-between items-center py-2 mb-3">
                        <span class="text-[16px] leading-6">{subject}</span>
                        <img src={threeDot} alt="Options" width="20" height="20" class="cursor-pointer"/>
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
</div>
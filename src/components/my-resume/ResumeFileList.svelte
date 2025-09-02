<script>
    export let files = []
</script>

<ul class="">
    {#each files as file}
        <li class="">
            <div class="">
                <p class="">{file.name}</p>
                <p>{file.size}</p>
            </div>
            <div>
               <!-- {/*Button*/}  -->
            </div>
        </li>
    {/each}
</ul>
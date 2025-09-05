<script lang="ts">
  import TextEditor from '../my-resume/TextEditor.svelte'; // Adjust path as needed based on your project structure
  import closeIcon from '$lib/assets/icons/close.png';

  let visible = $state(false);
  let contentType = $state('');
  let title = $state('');

  export function show(type, t) {
    contentType = type;
    title = t;
    visible = true;
    console.log('Sidebar shown with content type:', contentType);
  }

  export function close() {
    visible = false;
    contentType = '';
  }
</script>

<div class={`fixed inset-0 z-50 flex ${visible ? 'visible' : 'invisible'}`}>
  <!-- Overlay -->
  <button
    type="button"
    class={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    onclick={close}
    aria-label="Close sidebar"
  ></button>

  {#if visible}
  <div class="fixed right-0 top-0 h-full md:w-[580px] bg-white shadow-lg z-50"> 
    <div class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-4 border-b-2 border-[#A3AED0] h-[92px] p-5">
        <h2 class="text-lg font-satoshi-regular font-medium ">{title}</h2>
        <button onclick={close} class="text-gray-500 hover:text-black focus:outline-none">
          <!-- Close icon or text; e.g., -->
          <span class="w-[36.59] h-[36.59] rounded-[100%] bg-[#F9F9F9]">
            <img src={closeIcon} alt="Close" width="12.59" height="12.59"/>
          </span> <!-- Or use an SVG/X icon -->
        </button>
        </div>

        {#if title === 'Add Text Content'}
              <TextEditor />
        {/if}
        <!-- Add more {#if contentType === 'otherType'}-->
     </div>
    </div>
    {/if}
</div>


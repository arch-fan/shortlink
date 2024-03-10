<script lang="ts">
  import { toast } from "./../utils/toast.ts";
  import "toastify-js/src/toastify.css";
  import type { ShortnerResponse } from "./../types/shortner.d.ts";

  let link = $state<string>();
  let shortened = $state<string>();

  async function submitLink(): Promise<void> {
    if (link) {
      try {
        const res = await fetch(`/api/short?link=${link}`);

        const data: ShortnerResponse = await res.json();

        if (res.status != 200) {
          toast({
            text: data.message,
            backgroundColor: "#f33",
            onClick: () => (link = ""),
          });
        } else {
          shortened = data.link;
        }
      } catch (err) {
        alert("There was an error, try again later.");
      }
    }
  }

  async function submitLinkWithEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      await submitLink();
    }
  }

  async function copyShortened() {
    if (shortened) {
      await navigator.clipboard.writeText(shortened);
      toast({
        text: "Link copied to clipboard",
        backgroundColor: "#4db34d",
      });
    }
  }
</script>

<div class="h-full w-full flex flex-col items-center">
  <div class="border-2 h-12 w-full flex rounded-xl">
    <input
      class="w-full text-xl outline-none bg-transparent text-white py-1 px-2"
      bind:value={link}
      on:keyup={submitLinkWithEnter}
      type="text"
      name="link"
    />
    <button disabled={!link} on:click={submitLink} class="h-full mr-2 flex">
      <svg class={`h-full w-auto p-1 ${link ? "fill-white" : "fill-gray-600"}` } viewBox="0 0 32 32">
        <path
          d="M31.083 16.589c0.105-0.167 0.167-0.371 0.167-0.589s-0.062-0.421-0.17-0.593l0.003 0.005c-0.030-0.051-0.059-0.094-0.091-0.135l0.002 0.003c-0.1-0.137-0.223-0.251-0.366-0.336l-0.006-0.003c-0.025-0.015-0.037-0.045-0.064-0.058l-28-14c-0.163-0.083-0.355-0.132-0.558-0.132-0.691 0-1.25 0.56-1.25 1.25 0 0.178 0.037 0.347 0.104 0.5l-0.003-0.008 5.789 13.508-5.789 13.508c-0.064 0.145-0.101 0.314-0.101 0.492 0 0.69 0.56 1.25 1.25 1.25 0 0 0 0 0.001 0h-0c0.001 0 0.002 0 0.003 0 0.203 0 0.394-0.049 0.563-0.136l-0.007 0.003 28-13.999c0.027-0.013 0.038-0.043 0.064-0.058 0.148-0.088 0.272-0.202 0.369-0.336l0.002-0.004c0.030-0.038 0.060-0.082 0.086-0.127l0.003-0.006zM4.493 4.645l20.212 10.105h-15.88zM8.825 17.25h15.88l-20.212 10.105z"
        ></path>
      </svg>
    </button>
  </div>

  {#if shortened}
    <div class="flex flex-col gap-2 items-center mt-2 w-full lg:w-auto">
      <h3>Your link shortened:</h3>
      <p
        class="py-6 flex lg:px-12 rounded-xl relative w-full lg:w-auto bg-[#0d0d0d] border-1 shadow-xl text-start"
      >
        <a
          href={shortened}
          class="text-[#09f] hover:underline w-full text-center hover:text-white"
          >{shortened}</a
        >

        <button class="absolute top-2 right-2 h-6 w-6" on:click={copyShortened}>
          <svg
            class="hover:fill-white lg:fill-gray-300 fill-white"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z"
            />
          </svg>
        </button>
      </p>
    </div>
  {/if}
</div>

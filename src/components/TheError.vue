<template>
  <div>
    <!-- Your main content here -->
    
    <!-- Popup -->
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex justify-center pt-4 px-4 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <!-- Popup content -->
        <div class="inline-block mt-[55%] align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white w-80 px-4 pt-5 pb-2 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <svg class="h-12 w-12 text-red-600 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-2xl leading-6 font-semibold text-red-600 uppercase">Error!</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 font-medium">Thank you for your request. <br> We are unable to continue the process.</p>
                  <p class="text-sm text-gray-500 mt-2">Please try again to complete the request.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Popup -->
  </div>
</template>
<script>
import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    },
    
  }
</script>

<template>
  <TheHeader title="Change District" />
  <div class="location-area px-5 py-7">
    <form @submit.prevent>
      <div class="mb-8">
        <label for="division" class="block mb-3">Select Division</label>
        <select id="division" class="select-input border border-primary rounded-lg focus:outline-none focus:ring-primary focus:border-primary block w-full p-2.5">
          <option >Choose a Division</option>
          <option value="dhaka">Dhaka</option>
          <option value="chitagang">Chitagang</option>
          <option selected value="rajshahi">Rajshahi</option>
          <option value="khulna">Khulna</option>
          <option value="barishal">Barishal</option>
          <option value="shylet">Shylet</option>
          <option value="rangpur">Rangpur</option>
          <option value="maymonshign">Maymonshign</option>
        </select>
      </div>
      <div class="mb-8">
        <label for="district" class="block mb-3">Select District</label>
        <select id="district" class="select-input border border-primary rounded-lg focus:outline-none focus:ring-primary focus:border-primary block w-full p-2.5">
          <option >Choose a District</option>
          <option value="bogra">Bogra</option>
          <option value="joypurhat">Joypurhat</option>
          <option value="naogaon">Naogaon</option>
          <option value="natore">Natore</option>
          <option value="chapainababgange">Chapainababgange</option>
          <option selected value="pabna">Pabna</option>
          <option value="rajshahi">Rajshahi</option>
          <option value="sherajgange">Sherajgange</option>
        </select>
      </div>
      <button class="w-full p-3 rounded-lg bg-primary text-white" type="submit">Change</button>
    </form>
  </div>
</template>
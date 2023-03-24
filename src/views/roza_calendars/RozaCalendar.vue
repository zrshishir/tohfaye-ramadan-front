<template>
    <v-container class="d-flex justify-center">
         <v-table >
            <thead>
                <tr>
                    <th class="text-left">
                        Name
                    </th>
                    <th class="text-left">
                        Date
                    </th>
                    <th class="text-left">
                        Day
                    </th>
                    <th class="text-left">
                        Shehri End Time
                    </th>
                    <th class="text-left">
                        Iftar Time
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in schedules" :key="item.name">
                    <td>{{ getIndex(item) }} Ramadan</td>
                    <td>{{ item.date }}</td>
                    <td>{{ getWeekDayName(item) }}</td>
                    <td>{{ item.shehri_time }}</td>
                    <td>{{ item.iftar_time }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>

<script>
import { looseIndexOf } from '@vue/shared';

export default {
    name: 'RozaCalendar',
    data() {
        return {
            schedules: [
                {
                    date: '2023/03/24',
                    shehri_time: '4:43',
                    iftar_time: '6:11',
                },
                {
                    date: '2023/03/25',
                    shehri_time: '4:42',
                    iftar_time: '6:11',
                },
            ],
        }
    },
    methods: {
        getIndex(item) {
            //ordinal suffix code 
            var number = looseIndexOf(this.schedules, item) + 1
            if (typeof number !== "number" || number < 1) return number.toString();
            
            const lastDigit = number % 10;
            const lastTwoDigits = number % 100;

            if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
                return number + "th";
            } else if (lastDigit === 1) {
                return number + "st";
            } else if (lastDigit === 2) {
                return number + "nd";
            } else if (lastDigit === 3) {
                return number + "rd";
            } else {
                return number + "th";
            }
        },
        getWeekDayName(item) {
            const date = new Date(item.date); // create a date object
            const options = { weekday: 'long' }; // set options to get the weekday name
            const dayName = date.toLocaleString('en-US', options); // get the day name as a string
            return dayName
        }
    }
}
</script>
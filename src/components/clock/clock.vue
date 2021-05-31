<template>
    <div class="clock clearfix">
        <div class="clock-header">
            <span>Время МСК</span>
        </div>
        <div class="clock-time">
            <span id="hours">{{ formatNumber(hour, 2) }}</span>
            <span class="point">:</span>
            <span id="min">{{ formatNumber(minute, 2) }}</span>
            <span class="point">:</span>
            <span id="sec">{{ formatNumber(second, 2) }}</span>
        </div>
        <div class="clock-date">
            <span id="date">{{ date }}</span>
        </div>
    </div>
</template>

<script>

import { DateTime } from 'luxon';

export default {
    name: 'clock',  
    data() {
        return {
            hour: 0,
            minute: 0,
            second: 0,
            date: '...',
        };
    },
    methods: {
        setupClock() {
            let monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
            let dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Черверг", "Пятница", "Суббота"];

            setInterval(() => {
                let msk = DateTime.local().setZone('Europe/Moscow');
                this.hour = msk.hour;
                this.minute = msk.minute;
                this.second = msk.second;

                this.date = `${dayNames[msk.weekday]} ${msk.day} ${monthNames[msk.month]} ${msk.year}`;
            }, 1000);
        },

        formatNumber(number, size) {
            let numberStr = '000000000000000000000000' + number.toString();
            return numberStr.substring(numberStr.length - size);
        }
    },
    created() {
        this.setupClock();
    },
}

</script>

<style lang="scss" scoped>

.clock {
    margin: 0 auto;
    padding-bottom: 5px;
    color: #aaa;
    text-align: center;
    overflow: hidden;
}

.clock .clock-header > span {
    font-size: 26px;
    font-weight: bold;
}

.clock .clock-time > span {
    font-size: 3.2em;
    text-shadow: 1px 1px 5px #ccc;
}

.clock .clock-time .point {
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
    
    -ms-opacity: 1;
    opacity: 1;
        
    -webkit-animation-delay: 1s;
    -moz-animation-delay: 1s;
    -ms-animation-delay: 1s;
    -o-animation-delay: 1s;

    -webkit-animation-duration: 1s;
    -moz-animation-duration: 1s;
    -ms-animation-duration: 1s;
    -o-animation-duration: 1s;
        
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    -ms-animation-iteration-count: infinite;
    -o-animation-iteration-count: infinite;

    -webkit-animation-name: pulsate;
    -moz-animation-name: pulsate;
    -ms-animation-name: pulsate;
    -o-animation-name: pulsate;

    animation-delay: 1s;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-name: pulsate;
}

@keyframes pulsate {
    0% {
        -ms-opacity: 0;
        opacity: 0;
    }
    50% {
        -ms-opacity: 1;
        opacity: 1;
    }
    100% {
        -ms-opacity: 0;
        opacity: 0;
    }
}

.clock .clock-date > span {
    font-size: 14px;
}

</style>
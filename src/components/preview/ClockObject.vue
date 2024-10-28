<template>
    <div id="ClockObject">
        <div id="background-layer"></div>
        <div id="clock-layer">
            <div class="clock" id="clock">
                <div class="digit" data-unit="hours-tens"><span>0</span></div>
                <div class="digit" data-unit="hours-ones"><span>0</span></div>
                <div class="colon">:</div>
                <div class="digit" data-unit="minutes-tens"><span>0</span></div>
                <div class="digit" data-unit="minutes-ones"><span>0</span></div>
                <div class="colon">:</div>
                <div class="digit" data-unit="seconds-tens"><span>0</span></div>
                <div class="digit" data-unit="seconds-ones"><span>0</span></div>
                <div id="ampm-indicator" class="ampm"></div>
                <div id="ampm-space" class="space"></div>
            </div>
        </div>
        <div id="foreground-layer"></div>
    </div>
</template>

<script>
export default {
    name: 'ClockDisplay',

}
</script>

<style scoped>
    
</style>

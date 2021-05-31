<template>
    <div style="height: 100%;">

<div class="tx_search tx_clearfix" style="padding-left: 20px;">
    <div>
        <input type="text" id="dates-filter" class="form-control" name="dates-filter" style="width: 100%; max-width: 100%;" />
    </div>
    <div>
        <div id="approval-objects-filter"></div>
    </div>
    <div>
        <div id="objects-filter" style="width: 100%;"></div>
    </div>
    <div>
        <div id="departments-filter" style="width: 100%;"></div>
    </div>
    <button id="search" class="RadButton RadButton_MetroTouch rbButton rbRounded rbIconButton">
        <span>Поиск</span>
    </button>
</div>

<l-map ref="map" id="map" style="width: 100%; height: 100%;"></l-map>

<div class="jobs-counter"></div>
<div class="jobs-legend">
    <div class="text-center" style="margin: 5px 0; color: #777;">Условные обозначения</div>
    <hr style="margin: 5px 0;"/>
    <table style="width: 100%;">
        <tr>
            <td class="text-center"><img src="/Images/legend-object-1.png"/></td>
            <td style="width: 80%;">Управление</td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-object-3.png"/></td>
            <td style="width: 80%;">НПС</td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-pin.png"/></td>
            <td style="width: 80%;">Указатель километра трубы</td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-marker.png"/></td>
            <td style="width: 80%;">Место проведения работы на МН</td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-cluster.png"/></td>
            <td style="width: 80%;">Сгруппированные работы на МН</td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-pipeline.png?v=1"/></td>
            <td style="width: 80%;">Магистральный нефтепровод ВСТО-II</td>
        </tr>
    </table>
    <hr style="margin: 5px 0;"/>
    <table style="width: 100%;">
        <tr>
            <td class="text-center"><img src="/Images/legend-marker-icon-0.png" style="width: 30px;"/></td>
            <td style="width: 80%;">Работа <span class="text-allowed">разрешена</span></td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-marker-icon-1.png" style="width: 30px;"/></td>
            <td style="width: 80%;">Работа <span class="text-suspended">приостановлена</span></td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-marker-icon-2.png" style="width: 30px;"/></td>
            <td style="width: 80%;">Работа <span class="text-completed">выполнена</span></td>
        </tr>
        <tr>
            <td class="text-center"><img src="/Images/legend-marker-icon-3.png" style="width: 30px;"/></td>
            <td style="width: 80%;">Работа <span class="text-denied">запрещена</span></td>
        </tr>
    </table>
</div>


    </div>
</template>

<script>

import Vue from 'vue';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
    name: 'jobs-map',
    components: {
        LMap,
        LTileLayer,
        LMarker,
    },
}

</script>

<style lang="scss" scoped>

        .tx_search > div {
            margin-top: 15px;
        }

        div.tx_search .RadButton.rbButton {
            color: #fff;
            border-radius: 0 5px 5px 0;
        }

        div.tx_home_page .tx_search {
            top: 2em;
            border-radius: 5px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
        }

        .jobs-counter, .jobs-legend {
            z-index: 500;
            position: absolute;
            padding: 5px 10px;
            color: #000;
            background: #fff none repeat scroll 0 0;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
        }

        .jobs-counter {
            left: 35px;
            top: 120px;
        }

        .jobs-legend {
            left: 35px;
            bottom: 20px;
            width: 490px;
        }

        .job-notification {
            width: 250px;
            height: 80px;
            padding: 0 10px;
            line-height: 80px;
            text-align: center;
            color: #000;
            font-size: 1em;
            font-weight: normal;
            vertical-align: middle;
            background: #fff none repeat scroll 0 0;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
        }

            .job-notification .fa {
                font-size: 1.5em;
                font-weight: normal;
                vertical-align: middle;
                margin-right: 10px;
            }

        .k-notification-wrap > .k-i-close {
            top: 10px;
        }

        #approval-objects-filter .k-dropdown,
        #objects-filter .k-dropdown,
        #departments-filter .k-dropdown {
            width: 100%;
        }

        .fa-map-marker {
            font-size: 18px;
        }

</style>
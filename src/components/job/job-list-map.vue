<template>

<div style="height: 100%; width: 100%;">
    <l-map 
        ref="myMap"
        v-bind="map"
        style="height: 100%; width: 100%;">
        <l-tile-layer 
            :url="url" 
            :attribution="attribution">
        </l-tile-layer>

        <!-- отрисовка pipeline -->
        <l-polyline v-for="(pipeline, index) in pipelineItems" :key="'pipeline_' + index" :lat-lngs="pipeline.coordinates"
                    v-bind="pipelineStyle">
        </l-polyline>

        <!-- затушевка области за пределами той где идет трубопровод  -->
        <l-polygon
            v-bind="mask">
        </l-polygon>

        <!-- отрисовка объектов -->
        <l-marker v-for="object in objects" :key="object.Type.Value + '_' + object.Id" 
                :lat-lng="[object.Coordinate.Lat, object.Coordinate.Lng]">
            <l-icon
                :icon-size="[32, 32]"
                :icon-anchor="[16, 16]"
                :shadow-size="[60, 40]"
                :shadow-anchor="[16, 24]"
                :popup-anchor="[0, -8]"
                :icon-url="'/Images/object-' + object.SubType.Value + '.png'"
                :shadow-url="'/Images/object-' + object.SubType.Value + '-shadow.png'">
            </l-icon>
            <l-tooltip>{{ object.Name }}</l-tooltip>
            <l-popup>{{ object.Name }}</l-popup>
        </l-marker>

        <l-circle-marker v-for="(border, index) in borders" :key="'border_' + index"
            :lat-lng="[border.Lat, border.Lng]"
            :radius="5"
            color="blue">
        </l-circle-marker>

    </l-map>
</div>

</template>

<script>

import MapService from '@/core/services/map-service';
import { LMap, LTileLayer, LMarker, LPolygon, LIcon, LTooltip, LPopup, LPolyline, LCircleMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { latLng, latLngBounds } from 'leaflet'; 

export default {
    name: 'job-list-map',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPolygon,
        LIcon,
        LTooltip,
        LPopup,
        LPolyline,
        LCircleMarker,
    },
    computed: {
        objects() {
            return this.pipelines.flatMap(p => p.Objects.filter(t => p.Coordinate != null));
        },

        borders() {
            return this.pipelines.flatMap(p => p.Borders);
        },

        pipelineItems() {
            return this.pipelines.map(p => ({
                id: p.PipelineId,
                coordinates: p.Coordinates.map(c => new latLng(c.Lat, c.Lng)),
            }));
        }
    },
    data() {
        let provider = 'sputnik.ru'; 

        return {
            url: 'http://10.247.0.31:88/api/maps/map/sputnik.ru/default/{s}.tiles.maps.sputnik.ru/{z}/{x}/{y}.png',
            provider: provider,

            map: {
                zoom: 5,
                minZoom: 5,
                maxZoom: 14,
                center: new latLng(45, 130),
                maxBounds: new latLngBounds(new latLng(60, 115), new latLng(40, 150)),

                mapOptions: {
                    zoomSnap: 0.5,
                },    
            },

            attribution: `АИС &laquo;Учет работ&raquo; &copy; ${provider}`,

            mask: {
                stroke: false,
                color: '#333',
                fillOpacity: 0.5,
                latLngs: [],
            },

            pipelines: [],
            pipelineStrokeDashoffset: 1000,

            pipelineStyle: {
                color: '#000',
                weight: 3,
                dashArray: '10, 10',
                lineCap: 'round',
                fill: false,
                dashOffset: '1000',
            },
        };
    },
    methods: {
        loadInitData() {
            MapService.getRegions()
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    let regions = response.data.Result;
                    this.createMask(regions.features[0].geometry);
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });

            MapService.getPipelinesMapData()
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.pipelines = response.data.Result;
                    //this.animatePipeline();
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        },

        createMask(geometry) {
            //внешняя граница маски
            let outerBounds = new latLngBounds(new latLng(-90, -360), new latLng(90, 360));

            var outerBoundsLatLngs = [
                outerBounds.getSouthWest(),
                outerBounds.getNorthWest(),
                outerBounds.getNorthEast(),
                outerBounds.getSouthEast()
            ];

            if (geometry.type === 'Polygon') {
                let latLngs = geometry.coordinates[0].map(p => new latLng(p[1], p[0]))
                this.mask.latLngs = [outerBoundsLatLngs, latLngs];
            } 
            else if (geometry.type === 'MultiPolygon') {
                let latLngs = geometry.coordinates.map(polygons => polygons[0].map(c => new latLng(c[1], c[0])));
                this.mask.latLngs = [outerBoundsLatLngs, latLngs];
            }
        },

        animatePipeline() {
            if (this.pipelineStrokeDashoffset < 0) this.pipelineStrokeDashoffset = 1000;
            this.pipelineStrokeDashoffset -= .5;
            if(Math.trunc(this.pipelineStrokeDashoffset) == this.pipelineStrokeDashoffset) {
                this.pipelineStyle.dashOffset = `${this.pipelineStrokeDashoffset}`;
            }
            requestAnimationFrame(this.animatePipeline);
        },


    //   this.$nextTick(() => {
    //     this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
    //   })



    },
    created() {
        this.loadInitData();
    },
}

</script>

<style lang="scss" scoped>

</style>
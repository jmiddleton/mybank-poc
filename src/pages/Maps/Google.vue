<template>
  <div>
    <h1 class="mapTitle page-title">
      Branches
    </h1>
    <div class="mapContainer">
      <GmapMap
        :center="{lat: -33.9681478, lng:151.1265894}"
        :zoom="12"
        style="width: 100%; height: inherit"
      >
      <GmapMarker
        :position="{lat: -33.9681478, lng:151.1265894}"
      />
      </GmapMap>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Branches',
};
</script>

<style src="./Branches.scss" lang="scss" scoped />

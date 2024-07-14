<template>
    <div>
      <v-dialog max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" style="width: 3vw;height: 3vw;border-radius: 50%;background: linear-gradient(90deg, #00c1ca, #01e1c5);
            color: #fff;display: flex;flex-direction: column;align-items: center;justify-content: center;">
            <img src="../../assets/bars.png" width="80%">
         </v-btn>
        </template>
  
        <template v-slot:default="{ isActive }">
          <v-card title="換桌">
            <template v-slot:text>
                <h1>你選擇的桌位如下</h1>
            </template>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="surface-variant"
                text="確定"
                variant="flat"
                @click="isActive.value = false"
              ></v-btn>
              <v-btn
                color="surface-variant"
                text="取消"
                variant="flat"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
  </template>
  <style lang="scss">
</style>
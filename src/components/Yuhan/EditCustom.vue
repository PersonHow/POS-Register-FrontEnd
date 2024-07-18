<script>
import { ref,nextTick } from 'vue';
import { useMenuStore } from '@/stores/MenuStore';
import 'bootstrap/dist/css/bootstrap.css'
import { Modal } from 'bootstrap';
export default{
    setup(){
        const MenuStore = useMenuStore()
        let custom_options = ref(MenuStore.custom_options)

        return {
            custom_options,
        }
    }
}
</script>

<template>
    <p class="h4">編輯客製化項目</p>
    <div class="d-flex mb-3">
        <small>請搜尋欲編輯項目或點選標籤</small>
    </div>
    <button type="button" class="btn btn-secondary mb-3">新增</button>
    <input class="form-control mb-3" list="datalistOptions" id="DataList" placeholder="輸入客製項目...">
    <datalist id="datalistOptions">
        <option v-for="option in custom_options" :key="option.custom_id" :value="option.options"></option>
    </datalist>
    <div v-for="option in custom_options" :key="option.custom_id" class="labels mb-3">
        <button type="button" class="btn btn-label" data-bs-toggle="modal" data-bs-target="#editModal">{{option.custom_id+". "+option.options}}</button>
    </div>
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">編輯選項</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                    <div class="mb-3">
                        <label for="custom_options" class="col-form-label">選項:</label>
                        <input type="text" class="form-control" id="custom_options">
                    </div>
                    <div class="mb-3">
                        <input class="form-check-input" type="checkbox"  id="flexSwitchCheckChecked">
                        <label class="form-check-label" for="flexSwitchCheckChecked">必選</label>
                    </div>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">其他說明:</label>
                        <textarea class="form-control" id="message-text"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="typo__label">選擇套用餐點</label>
                        <multiselect v-model="customsVal" track-by="name" 
                            label="name" :options="customs" :allow-empty="true" :multiple="true" disabled>
                        </multiselect>
                    </div>
                    
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Close</button>
                    <button type="button" class="btn btn-primary">儲存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.labels{
    padding: 5px;
}
.btn-label{
    background: #f0f0f0;
    box-shadow: 2px 1px 3px rgb(206, 206, 206);
}
</style>
// 定義defineStore
import {defineStore} from 'pinia'
import Swal from 'sweetalert2'
// 建立store
export const useMenuStore = defineStore("menuStore",{
    state(){
        return{
            menu:[], //DB裡的菜單
            custom_options:[], //DB裡的客製選項
            types:[], //菜單裡的所有種類
            working_areas:["煎台","油炸台","煮制台","飲料台","烤爐台","冷盤台"],
            toggleEdit: false,
            meal:{
                // meal_id:null,
                // type:"",
                // name:"",
                // description:"",
                // price:0,
                // img:"",
                // staff_id:null,
                // working_area:"",
            },
            //正在編輯的客製化選項
            updateCustom:[
                // {
                // custom_id:9,
                // option:"蘑菇醬+0;黑胡椒醬+0;紅酒醬+10",
                // meal_id:";1;3;5;",
                // ismustfill:true,
                // other:"紅酒醬僅周末提供",
                // staff_id:1
                // }
            ],
            newCustom:[],
            removeCustom:[],//按下刪除鍵待刪的項目
            staff:null
        }
    },
    getters:{
        getItemsByType: (state) => (type) => {
            if(type === 'all'){
                return state.menu
            }
            return state.menu.filter(item => item.type === type || item.working_area === type);
        },
        getItemsById: (state) => (meal) => {
            return state.menu.find(item => item.meal_id === meal.meal_id)
        },
        getOptionsByMealId: (state) => (meal_id) => {
            let option = [];
            state.custom_options.forEach(custom_option => {
                if (custom_option.meal_id.includes(";"+meal_id+";")) {
                    option.push({ name: custom_option.option, id: custom_option.custom_id })
                }
            });
            return option
        },
    },
    actions:{
        //取得菜單內餐點
        getMenu(){
            fetch("http://localhost:8080/menu",{
                method:'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.menu = data
                //將所有餐點類別取出 並過濾重複的種類
                let set = new Set(data.map(item => item.type))
                this.types = Array.from(set)
            })
        },
        //取得客製化選項
        getCustomOption(){
            fetch("http://localhost:8080/custom",{
                method:'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.custom_options = data.map(item => {
                    return {
                        custom_id: item.custom_id,
                        option: item.option,
                        meal_id: ";"+item.meal_id+";",
                        ismustfill: item.ismustfill,
                        other: item.other,
                        staff_id: item.staff_id,
                    }
                })
            })
        },
        confirmModal(){
            Swal.fire({
                title: '確定要刪除?',
                text: '此動作無法復原',
                icon: 'warning',
                confirmButtonColor: '#00c1ca',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                }
            });
        },
        // 先用meal_id來判斷餐點是否存在，存在就執行更新 或無則新增餐點
        setNewMenu(meal){
            let index = this.menu.findIndex(m => m.meal_id === meal.meal_id)
            
            let updateMenu  = {
                meal_id:meal.meal_id,
                type:meal.type,
                name:meal.name,
                description:meal.description,
                price:meal.price,
                img:meal.img,
                staff_id:1,
                working_area:meal.working_area,
            }
            if (index == -1) {
                fetch("http://localhost:8080/menu",{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(updateMenu)
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    Swal.fire({
                        title: '新增成功',
                        icon: 'success',
                        confirmButtonColor: '#00c1ca',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });

                })
            }else{
                fetch(`http://localhost:8080/menu/${meal.meal_id}`,{
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(updateMenu)
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                    Swal.fire({
                        title: '修改成功',
                        icon: 'success',
                        confirmButtonColor: '#00c1ca',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    })
                })
            }
        },
        //新增客製選項
        setNewOption(options){
            this.custom_options.push(options)
        },
        //編輯該編號之餐點
        editing(meal_id){
            this.meal = {...this.menu.find(meal => meal.meal_id === meal_id)}
            this.meal.option = this.getOptionsByMealId(meal_id)
            this.toggleEdit = true
            return this.meal
        },
        cancelEditing(){
            this.toggleEdit = false
        },
        clearMeal(){
            this.meal = {}
        },
        //刪除餐點 
        deleteMeal(meal_id){
            Swal.fire({
                title: '確定要刪除?',
                text: '此動作無法復原',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#00c1ca',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:8080/menu/${meal_id}`,{
                        method:'DELETE',
                    })
                    .then(res => res.text())
                    .then(data => {
                        console.log(data)
                        Swal.fire({
                            title: '已刪除',
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#00c1ca',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        })
                    })
                }
            })
        },
        pushCustomToList (custom) {
            if(custom.custom_id === "new" ){
                // 若為新值，將 custom 加入 newCustom中
                return this.newCustom.push(custom);
            } else if(!this.updateCustom.some(option => option.custom_id === custom.custom_id)){
                // 若不存在updateCustom中，將 custom 加入 updateCustom
                return this.updateCustom.push(custom);
            }
        },
        // 將選中的項目從列表移除 並加入待刪的陣列
        removeFromList(custom){
            let existingIndex = this.custom_options.findIndex(option => option.custom_id === custom.custom_id);
            this.custom_options.splice(existingIndex,1)
            if(custom.custom_id !== "new"){
                this.removeCustom.push(custom.custom_id)
            }else{
                this.newCustom = this.newCustom.filter(option => option !== custom)
            }
        },
        //新增、修改、刪除項目
        saveCustoms(){
            //更新舊有項目
            this.updateCustom.map(item => {
                item.meal_id = item.meal_id.join(";");
                return item;
            });
            let updateOld = fetch("http://localhost:8080/custom",{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(this.updateCustom)
            })
            .then(res => res.text())
            .then(data => {
                console.log(data)
                this.updateCustom = []
            })

            let addNew
            if(this.newCustom.length>0){
                this.newCustom.map(item => {
                    item.meal_id = item.meal_id.join(";");
                    item.custom_id = null
                    return item;
                });
                //新增客製項目
                addNew = fetch("http://localhost:8080/custom",{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(this.newCustom)
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                    this.newCustom = []
                })
            }
            let deleteCustom
            if(this.removeCustom.length>0){
                deleteCustom = fetch("http://localhost:8080/custom",{
                    method:'DELETE',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(this.removeCustom)
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                    this.removeCustom = []
                })
            }

            //兩個非同步方法執行完畢後跳成功提醒
            Promise.all([updateOld, addNew, deleteCustom]).then(() => {
                Swal.fire({
                    title: '修改成功',
                    icon: 'success',
                    confirmButtonColor: '#00c1ca',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            });
        }
    }
})
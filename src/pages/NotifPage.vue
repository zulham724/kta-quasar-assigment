<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-cyan-7">
        <q-icon name="home" style="font-size:1.5em" />
        <q-toolbar-title>
          <div class="text-body1">Hasil</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <div v-if="assigments.data.length==0 && !loading">
      <div class="row">
        <div class="col-12 q-pa-lg text-center">
          <div class="text-h5 text-black">
            Assigment masih kosong
          </div>
        </div>
      </div>
    </div>
    <q-infinite-scroll @load="onLoad" :offset="100" v-if="assigments.data.length>0">
    <q-intersection class="q-pa-xs" v-for="(assigment, id) in assigments.data" :key="id">
     <q-card class="my-card" style="background:url('statics/bg-list.png');background-size:cover" @click="$router.push({name:'studentassigment',params:{assigmentId :assigment.id}})">
      <q-card-section>
        <div class="text-weight-bold">{{assigment.name}}</div>
        <div class="text-weight-light">Kelas: {{assigment.grade.description}}</div>
        <div class="text-weight-light">Kode kelas: {{assigment.grade_code}}</div>
        <div class="text-weight-light">Semester: {{assigment.semester}}</div>
        
      </q-card-section>

      <q-card-actions @click.stop="copyCode(assigment.code)">
         <div id="rcorners1">
          <div class="row">
            <div class="col-6">
                  Kode Soal<br>
              <div class="text-weight-bold"> {{assigment.code}}</div>
            </div>
            <div class="col-3 offset-2">
                  <q-btn @click.stop="copyCode(assigment.code)" flat round color="black" icon="content_copy" />

            </div>
          </div>
          
        </div>
      </q-card-actions>
     
    </q-card>
    </q-intersection>
    <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  
   

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data(){
    return {
      assigments:{
        data:[]
      },
      tab: 'teacher',
      loading:false,
    }
  },
  computed:{
    ...mapState(['Setting','Assigment'])
  },
  created(){
    this.init();
  },
  mounted(){
   
  },
  methods:{
    init(){
     
      this.loading=true;
      this.$store.dispatch("Assigment/getSharedPublish").then(res=>{
        //console.log(res.data)
        this.assigments = res.data
      }).catch(res=>{ 
        this.loading=false;
      }).finally(res=>{
        this.loading=false;
      });

    },
    copyCode(value){
      var tempInput = document.createElement("input");
      tempInput.value = value;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    },
    onLoad(index, done){
      //console.log(this.assigments);
      this.assigments.next_page_url
        ? this.$store.dispatch("Assigment/nextSharedPublish", this.assigments.next_page_url).then(res =>{
          this.assigments.data = [...this.assigments.data, ...res.data.data];
          this.assigments.next_page_url = res.data.next_page_url;
          done();

          //console.log(this.assigments);
        })
        : done();
    }
  }
};
</script>

<style>
#rcorners1 {
  border-radius: 8px;
  background: #bae7e7;
  padding-left: 10px;
  width: 150px;
}
</style>

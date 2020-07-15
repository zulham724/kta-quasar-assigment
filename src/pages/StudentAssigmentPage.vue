<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-cyan-7">
          <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">Kode soal: {{assigment.code}}</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <div id="corner1" style="margin-top:10px;">
        <div style="padding:5px">
        <div  class="text-h5 text-white">
            {{assigment.name}}
            </div>
            <div class="text-white">
            {{assigment.grade.description}}
            </div>

             <div class="row">
                <div class="col-6">
                    Kode Soal<br>
                <div class="text-weight-bold"> {{assigment.code}}</div>
                </div>
                <div class="col-3 offset-2">
                    <q-btn flat round color="black" icon="content_copy" />

                </div>
            </div>
        </div>
        <div id="corner2">
            <div style="padding:5px">
                 <div class="text-white">
               Nilai 100
                </div>
            </div>
             <div id="corner3">
                <div class="text-h5">
                     Nilai Siswa
                </div>
                 <q-intersection class="q-pa-xs" v-for="(session, id) in sessions" :key="id">
                 {{id}}
                 </q-intersection>
              
            </div>
        </div>
        
    </div>

    
    
  
   

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    props:{
        assigment:null,
        sessions:[]
    },
  data(){
    return {
    }
  },
  computed:{
    ...mapState(['Setting','Assigment'])
  },
  created(){
    
    if(this.assigment==null){
        this.$router.back();
    }else{
        this.init();
    }
  },
  mounted(){
      console.log(this.assigment)
  },
  methods:{
    init(){
      this.loading=true;
      this.$store.dispatch("Assigment/getSharedPublish").then(res=>{
        //console.log(res.data)
        this.assigments = res.data
      }).catch(res=>{
        
      }).finally(res=>{

      });

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
#corner1 {
  border-top-right-radius: 50px;
  background: #08bdca;
}
#corner2 {
  border-top-right-radius: 50px;
  background: #4cdbe6;
}
#corner3 {
  border-top-right-radius: 50px;
  background:white;
}
</style>

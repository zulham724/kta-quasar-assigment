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
        <div class="q-pt-sm q-pl-md">
        <div  class="text-h5 text-white">
            {{assigment.name}}
            </div>
            <div class="text-white">
            {{assigment.grade.description}}
            </div>

                <div class="text-white">
               {{assigment.code}}<q-btn flat round color="white" @click="copyCode(assigment.code)" icon="content_copy"/>
                </div>
        </div>
        <div id="corner2">

                <div class="row">
                    <div class="col-3" style="border-right: 1px solid white;">
                        <div class="row justify-center">
                            <div class="text-body1 text-bold text-white justify-center">
                            {{assigment.sessions_count}}
                            </div>
                        </div>
                        <div class="row justify-center">
                            <div class="text-white justify-center">Sesi</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="row justify-center">
                            <div class="text-body1 text-bold text-white justify-center">
                            {{maxScore}}
                            </div>
                        </div>
                        <div class="row justify-center">
                            <div class="text-white justify-center">Nilai Max</div>
                        </div>
                    </div>
                    <div class="col-3 self-center">
                        <div class="row justify-center">
                            <div class="text-body1 text-bold text-white ">
                            {{avgScore}}
                            </div>
                        </div>
                        <div class="row justify-center">
                            <div class="text-white">Rata-rata</div>
                        </div>
                    </div>

                </div>
              

             <div id="corner3">
                <div class="text-h5 q-pa-sm">
                     Nilai Siswa
                </div>
                 <q-intersection class="q-pl-xs q-pr-md q-pb-xs" v-for="(session, id) in assigment.sessions" :key="id">

                    <q-card :class="session.pivot.total_score==null?'bg-red-11':'bg-blue-11'" @click="$router.push({name:'studentresult',params:{sessionId:session.id} })">

                        <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                            <q-img :src="`${Setting.storageUrl}/${session.user.avatar}`" width="15vw" no-default-spinner />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label lines="3">{{ session.user.name }}</q-item-label>
                        </q-item-section>
                        
                        <q-item-section side top v-if="session.pivot.total_score==null">
                            <q-icon name="warning" color="yellow" />
                            <q-item-label caption>Belum dinilai</q-item-label>
                        </q-item-section>
                        <q-item-section side top v-else>
                             <q-item-label caption>Nilai</q-item-label>
                            <div class="row justify-center">
                                <div class="text-black text-weight-bolder">{{session.pivot.total_score}}</div>
                            </div>
                        </q-item-section>

                        </q-item>
                    </q-card>
                      
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
        assigmentId:null
    },
  data(){
    return {
        assigment:{
            code:null,
            name:null,
            sessions:[],
            grade:{
                description:null,
            },
            max_score:0,
            avg_score:0,
            sessions_count:0
        }
    }
  },
  computed:{
    ...mapState(['Setting','Assigment']),
    maxScore(){
        return this.assigment.max_score!=null?this.assigment.max_score:0;
    },
    avgScore(){
        return this.assigment.avg_score!=null?this.assigment.avg_score:0;
    }
  },
  created(){
    this.init();
  },
  mounted(){
      console.log(this.assigment)
  },
  methods:{
    init(){
      this.loading=true;
      this.$store.dispatch("Assigment/getStudentAssigments", this.assigmentId).then(res=>{
        //console.log(res.data)
        this.assigment = res.data
      }).catch(res=>{
        
      }).finally(res=>{

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
    // onLoad(index, done){
    //   //console.log(this.assigments);
    //   this.assigments.next_page_url
    //     ? this.$store.dispatch("Assigment/nextSharedPublish", this.assigments.next_page_url).then(res =>{
    //       this.assigments.data = [...this.assigments.data, ...res.data.data];
    //       this.assigments.next_page_url = res.data.next_page_url;
    //       done();

    //       //console.log(this.assigments);
    //     })
    //     : done();
    // }
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
#rcorners1 {
  border-radius: 8px;
  background: #bae7e7;
  padding-left: 10px;
  width: 150px;
}
</style>

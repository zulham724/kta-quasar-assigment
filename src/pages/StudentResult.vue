<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-blue">
          <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">Hasil {{session.user.name}}</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>

      <div style="background:url('statics/background-header-nilai.png');background-size:cover;background-repeat:no-repeat;border-bottom-right-radius:25px;border-bottom-left-radius:25px;" class="q-pa-xs ">
       <div class="row">
        <div class="col-8" >
            
            <q-item v-if="session.user.name!=null">
                 <q-item-section avatar>
                    <q-avatar>
                     <q-img :src="`${Setting.storageUrl}/${session.user.avatar}`" width="15vw" no-default-spinner />
                      </q-avatar>
                    </q-item-section>

                <q-item-section>
                    <q-item-label lines="3">{{session.user.name}}</q-item-label>
                </q-item-section>

            </q-item>

        </div>
        <div class="col-4 q-pr-sm">
            <div class="row justify-end">
                <div class="text-white">Nilai</div>
            </div>
            <div class="row justify-end" >
                <div class="text-h4">{{scoreConvertion}}</div>
            </div>
        </div>
       </div>
    </div>
    
    </q-header>
<q-page>
    <q-stepper
    header-nav
      v-model="step"
      vertical
      color="primary"
      animated
    >

      <q-step v-for="(question, qi) in session.questions"
        :key="question.id"
        :name="qi+1"
        :title="`Soal nomor ${qi + 1}`"
        icon="settings"
        :done="step > qi+1"
        :caption="getPoint(question)"
        :error="question.score==null"
      >
       {{question.name}} 

            <div
                v-if="
                  question.assigment_question_list.assigment_type.description ==
                    'selectoptions'
                "
              >
                <q-input
                  disable
                  outlined
                  dense
                  autogrow
                  v-for="answer_list in question.answer_lists"
                  :key="`answer-${answer_list.id}`"
                  v-model="answer_list.name"
                  :rules="[val => !!val || 'Harus diisi']"
                >
                  <template v-slot:after>
                    <div>
                      <q-btn
                        round
                        icon="check"
                          :flat="false"
                        color="green"
                        v-if="answer_list.value==100"
                      /> 
                      <q-btn
                        round
                        icon="check"
                          :flat="false"
                          color="red"
                        v-else-if="answer_list.value==null && answer_list.id==question.answer.answer_list_id"
                      /> 
                      <q-btn
                        round
                        icon="check"
                          :flat="false"
                        v-else
                      /> 
                    </div>
                  </template>
                </q-input>
              </div>

              <div
                v-if="
                  question.assigment_question_list.assigment_type.description == 'textfield'
                "
              >
                <q-input
                  v-for="(answer_list, key) in question.answer_lists"
                  :key="key"
                  class="q-pa-sm"
                  outlined
                  dense
                  disable
                   :label="`Kunci Jawaban ${key+1}`"
                  v-model="answer_list.name"
                />
                <q-input
                  class="q-pa-sm"
                  outlined
                  dense
                  disable
                  label="Jawaban Siswa"
                  v-model="question.answer.name"
                />
              </div>

              <div
                v-if="
                  question.assigment_question_list.assigment_type.description == 'textarea'
                "
              >
                <q-input
                 v-for="(answer_list, key) in question.answer_lists"
                  :key="key"
                  class="q-pa-sm"
                  outlined
                  dense
                  disable
                  type="textarea"
                  :label="`Kunci Jawaban ${key+1}`"
                v-model="answer_list.name"
                />
                <q-input
                  class="q-pa-sm"
                  outlined
                  dense
                  disable
                  type="textarea"
                  label="Jawaban Siswa"
                  v-model="question.answer.name"
                />
              </div>

                <q-separator />
                <div class="row q-pt-sm">
                    <div class="col-8 column q-pt-md" >
                         <q-slider label :label-value="'Nilai: ' + question.score " label-always v-model="question.score" :step="5" :min="0" :max="100" v-if="question.assigment_question_list.assigment_type.description!='selectoptions'"/>
                    </div>
                    <div class="col-4 q-pl-sm column">
                        <q-btn
                        v-if="qi != 0"
                        flat
                        @click="step = step - 1"
                        color="primary"
                        label="Kembali"
                        class="q-ml-sm"
                        />
                        <q-btn
                        v-if="qi + 1 != session.questions.length"
                        outline
                        rounded
                        @click="[step++]"
                        color="primary"
                        label="Lanjut"
                        />
                        <q-btn
                        v-if="qi + 1 == session.questions.length"
                        outline
                        rounded
                        @click="submitScore"  
                        color="primary"
                        label="Selesai"
                        :loading="loading"
                        :disable="loading"
                        />
                    </div>

                </div>
               
                                        
      </q-step>


    </q-stepper>
</q-page>
   

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    props:{
        sessionId:null,
        assigmentId:null,
    },
  data(){
    return {
        loading:false,
        session:{
            user:{
                name:null,
                avatar:null
            },
            questions:[]
        },
         step: 1
    }
  },
  computed:{
    ...mapState(['Setting','Assigment','StudentAssigment']),
    scoreConvertion(){
        let score=0;
        this.session.questions.map(function(e){
            if(e.assigment_question_list.assigment_type.description=="selectoptions" && e.answer.value==100)score+=100;
            else{
                score+=e.score;
            }
        });
        if(score==0)return 0;
        score=(score/(100*this.session.questions.length))*100;
        return score.toString().indexOf('.')>=1? score.toFixed(2):score;
    },
    
 
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
      this.$store.dispatch("Assigment/getStudentSession", this.sessionId).then(res=>{
        //console.log(res.data)
        this.session = res.data
      }).catch(res=>{
        
      }).finally(res=>{
          this.loading=false;
      });

    },
    getPoint(question){
        if(question.answer.value==100)return "Point: 100/100";
        else return "Point: "+(question.score==null?0:question.score) +"/100";
    },
    submitScore(){
        this.loading=true;
        this.$store.dispatch("Assigment/saveScore", this.session).then(res=>{
            let payload={ assigment_id:this.session.assigment_session.assigment_id, session_id:this.session.id, session:res.data}
            this.$store.dispatch("StudentAssigment/setSessionById", payload).then(res=>{
               this.$q.notify("Berhasil menyimpan nilai");
                this.$router.back();
            })
           
            
        }).catch(res=>{
            this.$q.notify("Terjadi kesalahan");
        }).finally(res=>{
            this.loading=false;
        });
    }
   
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

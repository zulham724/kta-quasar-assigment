<template>
  <div>
    <q-pull-to-refresh @refresh="onRefresh">
    <q-header>
      <q-toolbar class="bg-blue">
        <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">
            Kode soal: {{ assigment.code ? assigment.code : "" }}
          </div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <q-page>
    <div id="corner1" style="margin-top:10px;" class="bg-blue-6">
      <div class="q-pt-sm q-pl-md">
        <div class="text-h5 text-white">
          {{ assigment.name ? assigment.name : "" }}
        </div>
        <div class="text-white">
          {{ assigment.grade ? assigment.grade.description : "" }}
        </div>

        <div class="text-white">
          {{ assigment.code ? assigment.code : ""
          }}<q-btn
            flat
            round
            color="white"
            @click="copyCode(assigment.code)"
            icon="content_copy"
          />
        </div>
      </div>
      <div id="corner2" class="bg-blue-4">
        <div class="row">
          <div class="col-3" style="border-right: 1px solid white;">
            <div class="row justify-center">
              <div class="text-body1 text-bold text-white justify-center">
                {{ assigment.sessions_count ? assigment.sessions_count : "" }}
              </div>
            </div>
            <div class="row justify-center">
              <div class="text-white justify-center">Sesi</div>
            </div>
          </div>
          <div class="col-3  self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold text-white justify-center">
                {{ assigment.max_score ? assigment.max_score : "-" }}
              </div>
            </div>
            <div class="row justify-center">
              <div class="text-white justify-center">Nilai Max</div>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold text-white ">
                {{ assigment.avg_score ? assigment.avg_score : "-" }}
              </div>
            </div>
            <div class="row justify-center">
              <div class="text-white">Rata-rata</div>
            </div>
          </div>
        </div>

        <div id="corner3" class="bg-blue-1">
          <div class="text-h5 q-pa-sm">
            Nilai Siswa
          </div>
        
            <q-infinite-scroll
              @load="onLoad"
              :offset="250"
              v-if="sessions.length>0"
            >
              <q-intersection
                class="q-pl-xs q-pr-md q-pb-xs"
                v-for="(session, id) in sessions"
                :key="id"
              >
                <student-session-item-component
                  :session="session"
                ></student-session-item-component>
              </q-intersection>
            </q-infinite-scroll>
          
        </div>
      </div>
    </div>
    </q-page>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    StudentSessionItemComponent: () =>
      import("components/assigment/studentsession/ItemComponent.vue")
  },
  props: {
    assigmentId: null
  },
  data() {
    return {
      assigment: {
        code: null,
        name: null,
        sessions: [],
        grade: {
          description: null
        },
        max_score: 0,
        avg_score: 0,
        sessions_count: 0
      },
      sessions:[]
    };
  },
  computed: {
    ...mapState(["Setting", "StudentAssigment"]),
    maxScore() {
      return this.assigment.max_score != null ? this.assigment.max_score : 0;
    },
    avgScore() {
      return this.assigment.avg_score != null
        ? Math.floor(this.assigment.avg_score)
        : 0;
    }
  },
  created() {
    this.init();
  },
  mounted() {
    console.log('sssss');
    console.log(this.StudentAssigment.items);
  },
  methods: {
    init() {
      this.$store
        .dispatch("StudentAssigment/getAssigment", {assigment_id:this.assigmentId, isRefresh:false})
        .then(res => {
          this.assigment = res;
        });
      this.$store
        .dispatch("StudentAssigment/index", {assigment_id:this.assigmentId, isRefresh:false})
        .then(res => {
          this.sessions=res.sessions.data;
          //console.log(res.sessions);
          //console.log(res)
          //alert(this.sessions)
        });
    },
    onRefresh(done){
      Promise.all([
        this.$store.dispatch("Auth/getAuth"),
        this.$store.dispatch("StudentAssigment/getAssigment", {assigment_id:this.assigmentId, isRefresh:true}),
        this.$store.dispatch("StudentAssigment/index", {assigment_id:this.assigmentId, isRefresh:true})
      ]).then(res => {
        console.log(res)
        this.assigment = res[1];
        this.sessions = res[2].sessions.data;
        console.log("aa")
        console.log(res[2].sessions)
        if (done) done();
      });
    },
    copyCode(value) {
      var tempInput = document.createElement("input");
      tempInput.value = value;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    },
     onLoad(index, done){
       let current_session=this.StudentAssigment.items.find(e=>e.assigment_id==this.assigmentId);
       if(current_session){
         current_session.sessions.next_page_url
        ? this.$store.dispatch("StudentAssigment/next", current_session).then(res =>{
            this.sessions=this.StudentAssigment.items.find(e=>e.assigment_id==this.assigmentId).sessions.data;
           done();
        })
        : done();
       }else{
         done();
       }
        
    }
  }
};
</script>

<style>
#corner1 {
  border-top-right-radius: 50px;
}
#corner2 {
  border-top-right-radius: 50px;
}
#corner3 {
  border-top-right-radius: 50px;
}
#rcorners1 {
  border-radius: 8px;
  background: #bae7e7;
  padding-left: 10px;
  width: 150px;
}
</style>

var url = 'http://api-pets.fituapp.com/api/v1/pets?token=119dd1bd86728b407fe82fce1f8b9369';
var token = '?token=119dd1bd86728b407fe82fce1f8b9369';
var url_main = 'http://api-pets.fituapp.com/api/v1/pets';

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({ 
    search: '', //para el cuadro de búsqueda de datatables  
    snackbar: false, //para el mensaje del snackbar   
    textSnack: 'texto snackbar', //texto que se ve en el snackbar 
    dialog: false, //para que la ventana de dialogo o modal no aparezca automáticamente      
    //definimos los headers de la datatables  
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id',
      },
      { text: 'NAME', value:'name'},
      { text: 'KIND', value:'kind'},
      { text: 'BREED', value: 'breed'},
      { text: 'AGE', value: 'age'},
      { text: 'GENDER', value: 'gender'},
      { text: 'COLOR', value: 'color'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    pets: [], //definimos el array moviles
    editedIndex: -1,
    editado: {
      id:'',
      name: '',
      kind: '',
      breed: '',
      age: '',
      gender: '',
      color: '',
    },
    defaultItem: {
      id:'',
      name: '',
      kind: '',
      breed: '',
      age: '',
      gender: '',
      color: '',
    },
  }),

  computed: {
    //Dependiendo si es Alta o Edición cambia el título del modal  
    formTitle () {
      //operadores condicionales "condición ? expr1 : expr2"
      // si <condicion> es true, devuelve <expr1>, de lo contrario devuelve <expr2>    
      return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
    },
  },

  watch: {
    dialog (val) {
      val || this.cancelar()
    },
  },

  created () {
      this.listarPets()
  },

  methods: {      
     //PROCEDIMIENTOS para el CRUD  
    //Procedimiento Listar todos  
    listarPets:function(){
        axios.get(url).then(response =>{
           this.pets = response.data;       
        }).catch (e=>console.log(e) );
    },          
    //Procedimiento Alta de todos.
    guardarPets:function(){
        axios.post(url, {name:this.name, kind:this.kind, breed:this.breed, age:this.age, gender:this.gender, color:this.color }).then(response =>{
            this.listarPets();
        }).catch (e=>console.log(e) );         
         this.name = "",
         this.kind = "",
         this.breed = "",
         this.age = "",
         this.gender = "",
         this.color = ""
    },  
    //Procedimiento EDITAR.
    editarPet:function(id,name, kind, breed, age, gender, color ){       
       axios.put(url_main+'/'+id+token, {name:name, kind: kind, breed:breed, age:age, gender:gender, color:color }).then(response =>{
          this.listarPets(); 
          console.log(response);          
        }).catch (e=>console.log(e));                 
    },    
    //Procedimiento BORRAR.
    borrarPet:function(id){
        axios.delete(url_main+'/'+id+token).then(response =>{           
            this.listarPets();
            console.log(response);          
          }).catch (e=>console.log(e));   
    },             
    editar (item) {    
      this.editedIndex = this.pets.indexOf(item)
      this.editado = Object.assign({}, item)
      this.dialog = true
    },
    borrar (item) { 
      const index = this.pets.indexOf(item)
      
      console.log(this.pets[index].id) //capturo el id de la fila seleccionada 
        var r = confirm("¿Está seguro de borrar el registro?");
        if (r == true) {
        this.borrarPet(this.pets[index].id)    
        this.snackbar = true
        this.textSnack = 'Se eliminó el registro.'    
        } else {
        this.snackbar = true
        this.textSnack = 'Operación cancelada.'    
        }    
    },
    cancelar () {
      this.dialog = false
      this.editado = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    guardar () {
      if (this.editedIndex > -1) {
          //Guarda en caso de Edición
        //this.userId=this.editado.userId
        this.id=this.editado.id          
        this.name=this.editado.name          
        this.kind=this.editado.kind
        this.breed=this.editado.breed
        this.age=this.editado.age
        this.gender=this.editado.gender
        this.color=this.editado.color
        this.snackbar = true
        this.textSnack = '¡Actualización Exitosa!'  
        this.editarPet(this.id, this.name, this.kind, this.breed, this.age, this.gender, this.color)  
      } else {
          //Guarda el registro en caso de Alta  
          if(this.editado.name == "" || this.editado.kind == "" || this.editado.breed == "", this.editado.age == 0, this.editado.gender == "", this.editado.color == ""){
          this.snackbar = true
          this.textSnack = 'Datos incompletos.'      
        }else{
          this.name=this.editado.name
          this.kind=this.editado.kind
          this.breed=this.editado.breed          
          this.age=this.editado.age          
          this.gender=this.editado.gender          
          this.color=this.editado.color          
          this.snackbar = true
          this.textSnack = '¡Alta exitosa!'
          this.guardarPets()
        }       
      }
      this.cancelar()
    },
  },
});
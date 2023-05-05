const json_file =   '[{"id":1, "nombre":"Clark", "apellido":"Kent", "edad":45, "alterego":"Superman", "ciudad":"Metropolis", "publicado":2002},'
                    +'{"id":2, "nombre":"Bruce", "apellido":"Wayne", "edad":35, "alterego":"Batman", "ciudad":"Gotica", "publicado":20012},'
                    +'{"id":3, "nombre":"Bart", "apellido":"Alen", "edad":30, "alterego":"Flash", "ciudad":"Central", "publicado":2017},'
                    +'{"id":4, "nombre":"Lex", "apellido":"Luthor", "edad":18, "enemigo":"Superman", "robos":500, "asesinatos":7},'
                    +'{"id":5, "nombre":"Harvey", "apellido":"Dent", "edad":20, "enemigo":"Batman", "robos":750, "asesinatos":2},'
                    +'{"id":666, "nombre":"Celina", "apellido":"kyle", "edad":23, "enemigo":"Batman", "robos":25, "asesinatos":1}]'


//Classes Implementation
class Persona {
    constructor(id, nombre, apellido, edad) {
        if (id != null && nombre != null && apellido != null && edad > 15){
            this.id = parseInt(id);
            this.nombre = ToTitleCase(nombre);
            this.apellido = ToTitleCase(apellido);
            this.edad = parseInt(edad);
        }
    }
  }
  
  class Heroe extends Persona {
    constructor(id, nombre, apellido, edad, alterEgo, ciudad, publicado) {
        if (alterEgo != null && ciudad != null && publicado > 1940){
            super(id, nombre, apellido, edad);
            this.alterEgo = ToTitleCase(alterEgo);
            this.ciudad = ToTitleCase(ciudad);
            this.publicado = parseInt(publicado);
        }
    }
  }

  class Villano extends Persona {
    constructor(id, nombre, apellido, edad, enemigo, robos, asesinatos) {
        if (enemigo != null && robos > 0 && asesinatos > 0){
          super(id, nombre, apellido, edad);
          this.enemigo = ToTitleCase(enemigo);
          this.robos = parseInt(robos);
          this.asesinatos = parseInt(asesinatos);
        }
    }
  }

//Global instances
let globalArray = ParseJson();
let lastHeader;
let lastOrder;
let currentSorter = GetSorter("th0", "ASC");


//EVENT LISTENERS
window.addEventListener("load", () => {
    DrawTable();
    AddCheckboxesEvents();
    $("btn_add").addEventListener("click", (e) => {
        SwitchView(e);
        NewRow();
    });
    $("btn_cancel").addEventListener("click", (e) => {
        SwitchView(e);
        HideAllErrorsTags();
    });
    $("btn_accept").addEventListener("click", (e) => ValidateForm(e));
    $("btn_delete").addEventListener("click", (e) => DeleteEntry(e));
    $("cmbfilter").addEventListener("change", () => ReDrawTable());
    $("btncalcular").addEventListener("click", CalcularPromedio);
    $("field_tipo").addEventListener("change", () => ChangeFormView());
    AddTableSortEvents();
});

function AddCheckboxesEvents(){
    $("chk0").addEventListener("click", () => { ToggleClass($("col0"), "collapsed"); } );
    $("chk1").addEventListener("click", () => { ToggleClass($("col1"), "collapsed"); } );
    $("chk2").addEventListener("click", () => { ToggleClass($("col2"), "collapsed"); } );
    $("chk3").addEventListener("click", () => { ToggleClass($("col3"), "collapsed"); } );
    $("chk4").addEventListener("click", () => { ToggleClass($("col4"), "collapsed"); } );
    $("chk5").addEventListener("click", () => { ToggleClass($("col5"), "collapsed"); } );
    $("chk6").addEventListener("click", () => { ToggleClass($("col6"), "collapsed"); } );
    $("chk7").addEventListener("click", () => { ToggleClass($("col7"), "collapsed"); } );
    $("chk8").addEventListener("click", () => { ToggleClass($("col8"), "collapsed"); } );
    $("chk9").addEventListener("click", () => { ToggleClass($("col9"), "collapsed"); } );
}

function AddTableSortEvents(){
    let headers = Array.from($("table_header").getElementsByTagName("th"));
    headers.forEach(th => {
        th.addEventListener("click", (e) => {
            UpdateSorter(e.target.id);
            ReDrawTable();
        })
    });
}

///////////////////////////////////////Functions/////////////////////////////////////
//// General Functions ////
function $(id){
    return document.getElementById(id);
}

function ToggleClass(element, classname){
    if(element != null) {
        element.classList.toggle(classname);
    }
}

function NextId(){
    const sorted_array = globalArray.sort((e1, e2) => NumberComparer(e1.id, e2.id, "ASC"));
    let nextId = sorted_array[0].id;
    let len = sorted_array.length;
    for (let i = 0; i<len ; i++, nextId++){
        if(nextId != sorted_array[i].id){
            return nextId;
        }
    }
    return nextId++;
}

function SwitchView(event){
    event.preventDefault();
    ToggleClass($("table-container"), "hidden");
    ToggleClass($("form-container"), "hidden");
}

function SetValue(element, value){
    element.value = value;
}

function SetInnerText(element, text){
    element.firstChild.nodeValue = text;
}


function ParseJson(){
    let json = JSON.parse(json_file);
    let items = [];
    json.forEach(e => {
        if(e.id != undefined && e.nombre != undefined && e.apellido != undefined && e.edad != undefined){
            let item;
            if (e.alterego != undefined && e.ciudad != undefined && e.publicado != undefined){
                item = new Heroe(e.id, e.nombre, e.apellido, e.edad, e.alterego, e.ciudad, e.publicado);
            } else if (e.enemigo != undefined && e.robos != undefined && e.asesinatos != undefined) {
                item = new Villano(e.id, e.nombre, e.apellido, e.edad, e.enemigo, e.robos, e.asesinatos);
            }
            items.push(item);
        }
    });
    return items;
}

function ToTitleCase(str){
    casedStr = str.toLowerCase()
                  .split(' ')
                  .map((word) => word.replace(word[0], word[0].toUpperCase()));

    return casedStr.join(' ');
}

function DisableElement(element, value){
    element.disabled = value;
}

//// Global Array functions ////
function AddItem(id, nombre, apellido, edad, tipo, alterEgo, ciudad, publicado, enemigo, robos, asesinatos){
    let element = null;

    if (tipo == 1){
        element = new Heroe(id, nombre, apellido, edad, alterEgo, ciudad, publicado);
    } else if (tipo == 2){
        element = new Villano(id, nombre, apellido, edad, enemigo, robos, asesinatos);
    }

    DeleteItem(id);
    globalArray.push(element);
}

function DeleteItem(id){
    globalArray = globalArray.filter((e) => e.id != id);
}

function GetArrayItemById(id){
    let len = globalArray.length;
    let element = null;

    for (let i = 0; i<len ; i++){
        if(id == globalArray[i].id){
            element = globalArray[i];
            break;
        }
    }
    return element;
}



//// LIST VIEW Functions ////
function DrawTable(filter=DefaultFilter){
    let table = $("main_table");
    const filtered = Array.from(globalArray.filter(filter));
    const sorted_array = filtered.sort(currentSorter);
    
    sorted_array.forEach(element => {
        let row = document.createElement('tr');
        let cells = [];
        let len = table.rows[0].cells.length;
        
        for (let i = 0; i < len; i++){
            cells.push(document.createElement('td'));
        }
        
        cells[0].appendChild(document.createTextNode(element.id));
        cells[1].appendChild(document.createTextNode(element.nombre));
        cells[2].appendChild(document.createTextNode(element.apellido));
        cells[3].appendChild(document.createTextNode(element.edad));
        if (element instanceof Heroe){
            cells[4].appendChild(document.createTextNode(element.alterEgo));
            cells[5].appendChild(document.createTextNode(element.ciudad));
            cells[6].appendChild(document.createTextNode(element.publicado));
        } else {
            cells[4].appendChild(document.createTextNode('-'));
            cells[5].appendChild(document.createTextNode('-'));
            cells[6].appendChild(document.createTextNode('-'));
        }
        if (element instanceof Villano){
            cells[7].appendChild(document.createTextNode(element.enemigo));
            cells[8].appendChild(document.createTextNode(element.robos));
            cells[9].appendChild(document.createTextNode(element.asesinatos));
        } else {
            cells[7].appendChild(document.createTextNode('-'));
            cells[8].appendChild(document.createTextNode('-'));
            cells[9].appendChild(document.createTextNode('-'));
        }
        
        cells.forEach(cell => {
            row.appendChild(cell);
        });

        table.appendChild(row);
                
        row.addEventListener("dblclick", (e) => {
            let id = e.target.parentNode.firstChild.innerText;
            console.log(id);
            EditRow(id);
            SwitchView(e);
        })
    });
}

function ReDrawTable(){
    ClearTable($("main_table"));
    let filter = GetFilter($("cmbfilter"));
    DrawTable(filter);
}

function ClearTable(table){
    while (table.rows.length > 1){
        table.deleteRow(1);
    }
}


//Sort
function NumberComparer(attr1, attr2, order){
    val1 = (attr1 == undefined) ? Infinity : attr1 ;
    val2 = (attr2 == undefined) ? Infinity : attr2 ;
    return (order == "ASC") ? val1 - val2 : val2 - val1 ;
}

function StringComparer(attr1, attr2, order){
    val1 = (attr1 == undefined) ? "" : attr1 ;
    val2 = (attr2 == undefined) ? "" : attr2 ;
    return (order == "ASC") ? val1.localeCompare(val2) : val2.localeCompare(val1) ;
}

function UpdateSorter(id){
    let order = "ASC";
    if(lastHeader == id){
        order = (lastOrder == "ASC") ? "DESC" : "ASC" ;
    }
    currentSorter = GetSorter(id, order);
}

function GetSorter(id, order){
    let delegate;
    lastHeader = id;
    lastOrder = order;

    switch(id){
        case "th1":
            delegate = (e1, e2) => StringComparer(e1.nombre, e2.nombre, order);
            break;
        case "th2":
            delegate = (e1, e2) => StringComparer(e1.apellido, e2.apellido, order);
            break;
        case "th3":
            delegate = (e1, e2) => NumberComparer(e1.edad, e2.edad, order);
            break;
        case "th4":
            delegate = (e1, e2) => StringComparer(e1.alterEgo, e2.alterEgo, order);
            break;
        case "th5":
            delegate = (e1, e2) => StringComparer(e1.ciudad, e2.ciudad, order);
            break;
        case "th6":
            delegate = (e1, e2) => NumberComparer(e1.publicado, e2.publicado, order);
            break;
        case "th7":
            delegate = (e1, e2) => StringComparer(e1.enemigo, e2.enemigo, order);
            break;
        case "th8":
            delegate = (e1, e2) => NumberComparer(e1.robos, e2.robos, order);
            break;
        case "th9":
            delegate = (e1, e2) => NumberComparer(e1.asesinatos, e2.asesinatos, order);
            break;
        default:
            delegate = (e1, e2) => NumberComparer(e1.id, e2.id, order);
            break;
    }
    return delegate;
}

function DefaultSorter(e1, e2){
    return e1.id - e2.id;
}


//Filter
function GetFilter(cmb){
    let delegate;
    switch(cmb.value){
        case "heroes":
            delegate = FilterHeroes;
            break;
        case "villains":
            delegate = FilterVillains;
            break;
        default:
            delegate = DefaultFilter;
            break;
    }
    return delegate;
}

function DefaultFilter(element){
    return element instanceof Persona || element instanceof Heroe || element instanceof Villano;
}

function FilterHeroes(element){
    return element instanceof Heroe;
}

function FilterVillains(element){
    return element instanceof Villano;
}

//Calcular Promedio
function CalcularPromedio(){
    let filterDelegate = GetFilter($("cmbfilter"));
    let filtered = globalArray.filter(filterDelegate);
    let total = filtered.length;
    let sum = 0;
    sum = filtered.map((e)=> (e.edad)).reduce((a,b) => { return a + b; });
    let avg = sum / total;
    console.log("Avg: " + avg);
    console.log("Sum: " + sum);
    console.log("Total: " + total);
    $("txtresultado").value = avg.toFixed(2);
}



//// FORM VIEW Functions ////
function ValidateForm(e){
    let noError = 0;
    const tipo = $("field_tipo");

    noError += showError($("field_nombre"),   $("error_nombre"));
    noError += showError($("field_apellido"), $("error_apellido"));
    noError += showError($("field_edad"),     $("error_edad"));
    if (tipo.value == "tipo1") {
        noError += showError($("field_alterego"),  $("error_alterego"));
        noError += showError($("field_ciudad"),    $("error_ciudad"));
        noError += showError($("field_publicado"), $("error_publicado"), 1940);
    }else {
        noError += showError($("field_enemigo"),    $("error_enemigo"));
        noError += showError($("field_robos"),      $("error_robos"));
        noError += showError($("field_asesinatos"), $("error_asesinatos"));
    }

    if (noError == 0){
        CreateNewEntry();
        SwitchView(e);
    }
}

function NewRow(){
    DisableElement($("field_tipo"), false);
    $("btn_delete").className = "dangerzone hidden";
    LoadDataForm(NextId(), "", "", "", 1, "", "", "", "");
}

function EditRow(id){
    let element = GetArrayItemById(id);
    let tipo = 0;
    let alterEgo = "";
    let ciudad = "";
    let publicado = "";
    let enemigo = "";
    let robos = "";
    let asesinatos = "";

    if (element instanceof Heroe){
        tipo = 1;
        alterEgo = element.alterEgo;
        ciudad = element.ciudad;
        publicado = element.publicado;
    } else if (element instanceof Villano) {
        tipo = 2;
        enemigo = element.enemigo;
        robos = element.robos;
        asesinatos = element.asesinatos;
    }
    DisableElement($("field_tipo"), true);
    $("btn_delete").className = "dangerzone";
    LoadDataForm(id, element.nombre, element.apellido, element.edad, tipo, alterEgo, ciudad, publicado, enemigo, robos, asesinatos);
}

function CreateNewEntry(){
    let id = $("field_id").value;
    let nombre = $("field_nombre").value;
    let apellido = $("field_apellido").value;
    let edad = $("field_edad").value;
    let tipo = ($("field_tipo").value == "tipo1") ? 1 : 2 ;
    let alterEgo = $("field_alterego").value;
    let ciudad = $("field_ciudad").value;
    let publicado = $("field_publicado").value;
    let enemigo = $("field_enemigo").value;
    let robos = $("field_robos").value;
    let asesinatos = $("field_asesinatos").value;
    

    AddItem(id, nombre, apellido, edad, tipo, alterEgo, ciudad, publicado, enemigo, robos, asesinatos);
    ReDrawTable();
}

function DeleteEntry(e){
    let confirmation = confirm("¿Está seguro/a que desea eliminar esta entrada?\nEsta acción NO se puede deshacer.");

    if (confirmation){
        let id = $("field_id").value;
        DeleteItem(id);
        ReDrawTable();
        SwitchView(e);
    }
}

function LoadDataForm(id, nombre, apellido, edad, tipo, alterEgo, ciudad, publicado, enemigo, robos, asesinatos){
    const field_tipo = $("field_tipo");
    if ((field_tipo.value == "tipo1" && tipo == 2) || (field_tipo.value == "tipo2" && tipo == 1)) {
        ChangeFormView();
    }
    field_tipo.value = (tipo == 1) ? "tipo1" : "tipo2" ;

    SetValue($("field_id"), id);
    SetValue($("field_nombre"), nombre);
    SetValue($("field_apellido"), apellido);
    SetValue($("field_edad"), edad);
    SetValue($("field_alterego"), alterEgo);
    SetValue($("field_ciudad"), ciudad);
    SetValue($("field_publicado"), publicado);
    SetValue($("field_enemigo"), enemigo);
    SetValue($("field_robos"), robos);
    SetValue($("field_asesinatos"), asesinatos);
}

function ChangeFormView(){
    ToggleClass($("input_alterego"), "hidden");
    ToggleClass($("input_ciudad"), "hidden");
    ToggleClass($("input_publicado"), "hidden");
    ToggleClass($("input_enemigo"), "hidden");
    ToggleClass($("input_robos"), "hidden");
    ToggleClass($("input_asesinatos"), "hidden");
}

function showError(field, fieldError, min=0, max=100) {
    let error = 0;
    if (field.validity.valid){
        SetInnerText(fieldError, ".");
        fieldError.className = "error unactive";
    } else {
        fieldError.className = "error active";
        error++;
        if (field.validity.valueMissing) {
            SetInnerText(fieldError, "Campo obligatorio.");
        } else if (field.validity.typeMismatch) {
            SetInnerText(fieldError, "Debe ingresar sólo números.");
        } else if (field.validity.tooShort) {
            SetInnerText(fieldError, "El campo debe tener como mínimo 2 caracteres.");
        } else if (field.validity.rangeUnderflow) {
            SetInnerText(fieldError, "El valor mínimo es " + min + ".");
        } else if (field.validity.rangeOverflow) {
            SetInnerText(fieldError, "El valor mínimo es " + max + ".");
        } else if (field.validity.patternMismatch) {
            SetInnerText(fieldError, "Sólo se aceptan caracteres alfabéticos y espacios.");
        }
    }
    return error;
}

function HideAllErrorsTags(){
    ResetErrorTag($("error_nombre"));
    ResetErrorTag($("error_apellido"));
    ResetErrorTag($("error_edad"));
    ResetErrorTag($("error_alterego"));
    ResetErrorTag($("error_ciudad"));
    ResetErrorTag($("error_publicado"));
    ResetErrorTag($("error_enemigo"));
    ResetErrorTag($("error_robos"));
    ResetErrorTag($("error_asesinatos"));
}

function ResetErrorTag(fieldError){
    fieldError.className = "error unactive";
}

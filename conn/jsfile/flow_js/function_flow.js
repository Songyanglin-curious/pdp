//-------------------�����б�����----------------------------------------------------------------------------

function getItemTextByValue(sSrc,v)
{
	if(Trim(v.toString())!="")
	{
	    var l = sSrc.options.length;
	    for (var i = 0;i < l;i++) {
		    var opt = sSrc.options[i];
		    if (opt.value != v)
		        continue;
		    return opt.text;
	    }
	}
	return "";
}
function selectIndex(s,v) {
	for (var i = 0;i < s.options.length;i++)
		if (s.options[i].value == v) {
			s.selectedIndex = i;
			return;
		}
}
function selectValue(s,v) {
	for (var i = 0;i < s.options.length;i++)
		if (s.options[i].innerText == v) {
			s.selectedIndex = i;
			break;
		}
}

function addOptGroup(selObj,text)
{
    var optGroup = document.createElement("OPTGROUP");  
    optGroup.label = text;
    selObj.appendChild(optGroup);
}

//ȡselect�����б�ֵ
function getSelectValue(listName){
   if(listName.selectedIndex!=-1){return listName.options[listName.selectedIndex].value}
   else{return ''}
}

//ȡselect�����б��ı�
function getSelectText(listName){
   if(listName.selectedIndex!=-1){return listName.options[listName.selectedIndex].innerText}
   else{return ''}
}

//��������б�Option
function addSelectOption(listName,optText,optValue,optSelected){
  var oOption = document.createElement("OPTION")
  listName.options.add(oOption)
  oOption.innerText = optText
  oOption.value = optValue
  oOption.selected = optSelected
  
}

//����б�
function emptyList(list){
  for(var i=0;list.length=0;i++){list.remove(i);}
}

//�����б�1���б�2
function copyList(list1,list2){
  emptyList(list2)
  for (i=0;i<list1.length ;i++ )
  {
	 addSelectOption(list2,list1.options[i].innerText,list1.options[i].value)
  }
}

//ѡ���ѡ�б�������
function selectListAll(listName){
	for (var i=0;i<listName.length ;i++ )
	{
		listName.options[i].selected = true
	}
}

//��ѡ���б��κ���
function selectListNone(listName){
	listName.selectedIndex = -1
}

//List2list:�б�1���б�2��ѡ�Ļ�����������
function List2list_addOne(list1,list2){
  var a = list1
  var b = list2
  
  if (a.selectedIndex!=-1){
	 var flag = '0'
	 for(var i=0;i<b.length;i++){
	   if(b.options[i].value==a.options[a.selectedIndex].value) flag = '1'
	 }

	 if(flag == '0'){
	   var oOption = document.createElement("OPTION")
	   b.options.add(oOption)
	   oOption.innerText = a.options[a.selectedIndex].innerText
	   oOption.value = a.options[a.selectedIndex].value	 
	 }	
	 a.remove(a.selectedIndex)  
  }
}

function List2list_delOne(list1,list2){
  List2list_addOne(list2,list1)
}

function List2list_addAll(list1,list2){
  var a = list1
  var b = list2

  for(var i=0;i<a.length;i++){
	 var flag = '0'
	 for(var j=0;j<b.length;j++){
	   if(b.options[j].value==a.options[i].value) flag = '1'
	 }

	 if(flag == '0'){
	   var oOption = document.createElement("OPTION")
	   b.options.add(oOption)
	   oOption.innerText = a.options[i].innerText
	   oOption.value = a.options[i].value	  
	 }	   	  
  }
  emptyList(a)
}

function List2list_delAll(list1,list2){
  List2list_addAll(list2,list1)
}

//-------------------��ѡ�򡢸�ѡ����----------------------------------------------------------------------------

//ȡ��ѡ���ֵ
function getRadioGroupValue(RadioGroup){
   for(var i=0;i<RadioGroup.length;i++)
      {if (RadioGroup[i].checked){return RadioGroup[i].value}}
   return ""
}

//ѡ�е�ѡ��
function setRadioGroupValue(RadioGroup,SetValue){
   if (SetValue!='')
   {
	  for(var i=0;i<RadioGroup.length;i++)
      {if (RadioGroup[i].value == SetValue){RadioGroup[i].checked = true;return true}}
	  return false
   }
   else {return false}   
}

//ȡ������ѡ���ֵ
function getSingleCheckBoxValue(checkBoxName){
  if(checkBoxName.checked){return checkBoxName.value}
  else{return ""}
}

//ѡ�е�����ѡ��
function setSingleCheckBoxValue(checkBoxName,setValue){
  if (setValue!='')
   {
	  if (checkBoxName.value == setValue){checkBoxName.checked = true;return true}
	  else{checkBoxName.checked = false;return false}
   }
   else {return false}  
}

//------------------------�ַ���������-------------------------------------------------------------------------

//ȥ���ַ�����ߵĿո�
function Ltrim(str)
{
   return str.replace(/ +/,"")
}

//ȥ���ַ����ұߵĿո�
function Rtrim(str)
{
   return str.replace(/ +$/,"")
}
function Trim(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

//���ַ���ת�������������ַ���ת��Ϊ0
function STR2Int(Str){
  if(Str==''){return 0}
  else{return parseInt(Str,10)}
}

//ת��ʱ��Ϊ'00'��ʽ:��'5'ת��Ϊ'05'
function Trans00Format(time){
  var timeStr = ''+time
  if(timeStr.length==1){return '0'+timeStr}
  else{return timeStr}
}

//------------------------��������ʱ�ĸ�������---------------------------------------------------------------------

//��������ʱ����Ƿ�������0-9
function checkNumberHelp(obj,AlertTxt){
  if(obj.value!=''){
	  if(!validCharCheck(obj.value,'0123456789')){if(AlertTxt!=''){alert(AlertTxt)};try{obj.focus()}catch(e){};obj.value='';return false;}
  }
}

//��������ʱ�����ֵ��Χ
function checkIntRangeHelp(obj,DefaultValue,AlertTxt,MaxInt,MinInt){
  if(obj.value=='' || isNaN(parseInt(obj.value,10))) {obj.value = DefaultValue;return false}
  obj.value = parseInt(parseFloat(obj.value),10)+''
  if(MaxInt!=null){
	  if(MaxInt < parseInt(obj.value,10)){
		  if(AlertTxt!='') alert(AlertTxt)
		  obj.value = DefaultValue
		  try{obj.focus()}catch(e){}
		  return false
      }
  }
  if(MinInt!=null){
	  if(MinInt > parseInt(obj.value,10)){
		  if(AlertTxt!='') alert(AlertTxt)
		  obj.value = DefaultValue 
		  try{obj.focus()}catch(e){}
		  return false
      }
  }
}

//��������ʱ�������ȱʡֵ
function quickInputHelp(obj,defaultValue){
	if(obj.value==defaultValue) obj.value = ''
}

//��������ʱ��������һ�����Ⱥ��Զ������ת�ƽ��㡣���������кŵ��Զ��ƽ���������onkeyup�¼��С�
function autoBlurHelp(inputObj,inputLength,focusObj){
  if (inputObj.value.length == inputLength) {inputObj.blur();focusObj.focus()}
}

//
function editCellHelp (CellId,Cell,ClassName,Maxlength,DefaultValue,AlertTxt,MaxNumber,MinNumber) {
   if (CellId!='' && CellId!=null){
     if (document.all) {
       var sizeText = Maxlength==''?Cell.innerText.length:Maxlength
       Cell.innerHTML = '&nbsp;<INPUT ID="'+CellId+'" class="'+ClassName+'" maxlength="'+Maxlength+'"  onclick="event.cancelBubble = true;" onchange="checkIntRangeHelp(this,'+DefaultValue+',\''+AlertTxt+'\','+MaxNumber+','+MinNumber+')";setCellHelp(this.parentElement, this.value)" onblur="setCellHelp(this.parentElement, this.value)" value="'+Cell.innerText+'" size="'+sizeText+'">'
       document.all(CellId).focus()
       document.all(CellId).select()
     }
     else if (document.getElementById) {
            Cell.normalize()
            var input = document.createElement('INPUT')
            input.setAttribute('value', Cell.firstChild.nodeValue)
            input.setAttribute('size', Cell.firstChild.nodeValue.length)
            input.onchange = function (evt) { 
               setCellHelp(this.parentNode, this.value) }
            input.onclick = function (evt) { 
               evt.cancelBubble = true
               if (evt.stopPropagation) evt.stopPropagation() }
            Cell.replaceChild(input, Cell.firstChild)
            input.focus()
            input.select()
     }
   }
}

function setCellHelp (Cell, Value) {
   if (document.all)
      Cell.innerText = Value;
   else if (document.getElementById)
      Cell.replaceChild(document.createTextNode(Value), Cell.firstChild);
}

//----------------------��Ч�Լ�麯��Check-----------------------------------------------------------------------------

//���Ŀ���ִ��Ƿ�ʹ�úϷ��ַ���
function validCharCheck(objStr,Letters){  
  for (var i=0; i<objStr.length; i++){
   var CheckChar = objStr.charAt(i)
   if (Letters.indexOf(CheckChar) == -1) return false
  }
  return true
}

//���Ŀ���ִ��Ƿ�ʹ���˷Ƿ��ַ���
function novalidCharCheck(objStr,Letters){
  for (var i=0; i<objStr.length; i++){
   var CheckChar = objStr.charAt(i)
   if (Letters.indexOf(CheckChar) >= 0) return false
  }
  return true
}

//�����ֵ��Χ
function intRangeCheck(objStr,MaxInt,MinInt){  
  if(objStr=='') return false
  if(MaxInt!=null){
	  if(MaxInt < parseInt(objStr,10)){		 
		  return false
      }
  }
  if(MinInt!=null){
	  if(MinInt > parseInt(objStr,10)){		  
		  return false
      }
  }
  return true
}


//Ŀ���ִ��Ƿ�ʹ�úϷ��ַ����ĺ���
function validStrCheck(obj,validStr,AlertTxt){

	if (obj.value!='' && !validCharCheck(obj.value,validStr))
	{
		if (AlertTxt!='') alert(AlertTxt)
		obj.value = '';try{obj.focus()}catch(e){};return false
	}
	else {return true}

}

//Ŀ���ִ��Ƿ�ʹ�÷Ƿ��ַ��ĺ���
function novalidStrCheck(obj,novalidStr,AlertTxt){
	if (obj.value!='' && !novalidCharCheck(obj.value,novalidStr))
	{
		if (AlertTxt!='') alert(AlertTxt)
		obj.value = '';try{obj.focus()}catch(e){};return false
	}
	else {return true}
}

//Ŀ���ִ��Ƿ�Ϊ�յĺ���
function emptyStrCheck(obj,AlertTxt){
	if (obj.value=='')
	{
		if (AlertTxt!='') alert(AlertTxt)
		obj.value = '';try{obj.focus()}catch(e){};return false
	}
	else {return true}
}

//���IP��ַ��ʽ
function validIPCheck(obj,objTxt){
  var ipStr = obj.value
  if (ipStr == '') {alert(objTxt+' - ip ��ַ����Ϊ��!');obj.value = '';try{obj.focus()}catch(e){};return false;}

  var flag = true
  var ip = ipStr.split('.')
  if (ip.length!=4) {alert(objTxt+' - ip ��ַ����ȷ!'); flag = false}
  else{
    for (var i=0;i<ip.length;i++){
	   var j = i+1
	   if (!validCharCheck(ip[i],'0123456789')) {alert(objTxt+' - ip ��ַ�� ('+j+') ����Ϊ������');flag = false;break}
	   if (!intRangeCheck(ip[i],255,0)) { alert(objTxt+' - ip ��ַ�� ('+j+') ��ֵ����!\nip ��ַ�η�Χ��0-255 ��');flag = false;break}	
	}
  }
  if (flag==false) {obj.value = '';try{obj.focus()}catch(e){};}	
  return flag
}

//�������ʼ���ʽ
function validEmailCheck(email){
}


//-------------------------------------------------ʱ������------------------------------------------------------------
   function GetDtTimeFromString(strDt)
  {
      var arr = GetYMD(strDt);
      if(arr.length<3)
        return null;
      return new Date(arr[0],parseInt(arr[1],10)-1,arr[2]);
  }
  function GetStrTime(dtTime)
  {
     var strTime = dtTime.getYear() + "-";
     strTime += dtTime.getMonth() + 1 + "-" ;
     strTime += dtTime.getDate() + " ";
     strTime += dtTime.getHours() + ":";
     strTime += dtTime.getMinutes() + ":";
     strTime += dtTime.getSeconds() ;
     return strTime;
  }
  function GetShortStrTime(dtTime)
  {
     var strTime = FormatTime(dtTime.getMonth() + 1) + "-" ;
     strTime += FormatTime(dtTime.getDate()) + " ";
     strTime += FormatTime(dtTime.getHours()) + ":";
     strTime += FormatTime(dtTime.getMinutes());
     return strTime;
  }
  function GetShortStrTimeY(dtTime)
  {
     var strTime = dtTime.getYear() + "-";
     strTime += FormatTime(dtTime.getMonth() + 1) + "-" ;
     strTime += FormatTime(dtTime.getDate()) + " ";
     strTime += FormatTime(dtTime.getHours()) + ":";
     strTime += FormatTime(dtTime.getMinutes());
     return strTime;
  }
  function GetShortStrTimeYMD(dtTime)
  {
     var strTime = dtTime.getYear() + "-";
     strTime += FormatTime(dtTime.getMonth() + 1) + "-" ;
     strTime += FormatTime(dtTime.getDate()) ;
     return strTime;
  }
  function GetYMD(strTime)
  {
      var arr = strTime.split(" ");
      if(arr.length == 0)
        return null;
      var arr1 = arr[0].split("-");
      if(arr.length == 1)
        return arr1;
      var arr2 = arr[1].split(":");
      for(var i=0;i<arr2.length;i++)
        arr1.push(arr2[i]);
      return arr1;
  }
  function FormatTime(num)
  {
     if(num <10)
        return "0" + num.toString();
     return num.toString();
  }
//-----------------------------------------------------table----------------------------------------------------  
  //����table�ļ��У�����ɾ����
    function deleteRows(tbl,r)
    {
        if(tbl.rows.length<=r)
            return;
        while(tbl.rows.length>r)
        {
            tbl.deleteRow();
        }
    }
    //����table�ļ��У�����ɾ����
    function deleteCells(tbl,c)
    {
        if(tbl.rows.length==0)
            return;
        if(tbl.rows(0).cells.length<=c)
            return;
        while(tbl.rows(0).cells.length>c)
        {
            for(var i=0;i<tbl.rows.length;i++)
            {
                tbl.rows(i).deleteCell();
            }
        }

    }
    function RemoveTrItem(tbl,tr)
    {
        if(tbl.rows.length==0)
            return;
        if(typeof(tr)=="undefined")
            return;
        for(var i=0;i<tbl.rows.length;i++)
        {
            if(tbl.rows(i) == tr)
                tbl.deleteRow(i);
        }
    }

//---------------------------------------------------------��������Ƿ���ȷ------------------------------------------------------
    function CheckIfFloat(s)
    {
        var f = parseFloat(s);
        if(isNaN(s))
            return false;
        return f == s
//        var patrn=/^\\(d+){1,2}(\\.\\d+)?$/; 
//        return patrn.test(s); 
    }
    function CheckIfInt(s)
    {
        var f = parseInt(s,10);
        if(isNaN(s))
            return false;
        return f == s
    }
//--------------------------------------------------------------------
     function ShowLableDept()
    {
        var selo = document.getElementById("selDept");
        var lblo = document.getElementById("lblDept");
        if(selo.options.length == 1 )
        {
            selo.style.display = "none";
            lblo.style.display = "";
            lblo.innerText = getItemTextByValue(selo,selo.value);
        }
    }
//---------------------------------------------div ��ʾ��Ϣ ���� alert----------------------------------------------------
    function GetIndex(div)
    {
        for(var i=0;i<arrMessageBox.length;i++)
        {
            if(arrMessageBox[i] == div)
                return i;
        }
        return -1;
    }
    
    var arrMessageBox = [];//���δ���ڵ�MessageBox
    var MessageBoxCount = 0;
    function MessageBox(mes,type)
    {
        this._className = "revpopup";
        this._pElement = document.body;
        this._livingTime = 1000;
        this._display = "block";
        this._message = mes;
        this._type = type;
        this._div = null;
        this.create = function(){
            this._div = document.createElement("div");
            this._div.id = "divMess" + MessageBoxCount;
            MessageBoxCount++;
            this._div.className = this._className;
            this._div.style.display = this._display;
            this._div.innerText = this._message;
            this._div.zIndex = 90 + MessageBoxCount;
            this._div.style.backgroundImage = getMessageBgImg();
            //this._div.style.borderColor =  this.getMessageColor();
            this._div.style.top = Math.round(this._pElement.clientHeight/2) - 100 + 10 * arrMessageBox.length  +"px";
            this._div.style.left = Math.round(this._pElement.clientWidth/2) - 150 - 10 * arrMessageBox.length +"px";
            this._pElement.appendChild(this._div);
            arrMessageBox.push(this._div);
            this.destroy();
        }
        this.destroyMessageBox = function(){
              if(arrMessageBox.length == 0)
                    return;
              this._pElement.removeChild(arrMessageBox[0]);
              arrMessageBox.splice(0,1);
        }
        this.destroy = function() {
            with(this){
                setTimeout(function(){destroyMessageBox()},_livingTime);
            }
            
        }
        this.getMessageColor = function(){
            switch(this._type)
            {
               case 0:
                  return "#00ff6c";
               case 1:
                  return "#fcff00";
               case 2:
                  return "#ff0000";
               default:
                  return "Black";
            }
        }
        this.getMessageBgImg = function(){
            var url = "url(../../i/";
            switch(this._type)
            {
               case 0:
                  url += "message_green.gif";
                  break;
               case 1:
                  url += "message_yellow.gif";
                  break;
               case 2:
                  url += "message_red.gif";
                  break;
               default:
                  return "";
            }
            return url + ")";
        }
        create();
    }


function ParseNumber(v, f) {
    var db = parseFloat(v);
    var ff = parseInt(f, 10);
    if (isNaN(db) || isNaN(ff) || ff < 0)
        return v;
    return db.toFixed(ff);
}
Vue.component("iform",{
    props:{
      dataSource:{
        type: Object,
      }
    },
    data(){
      let {formtitle,formdata,rulevalidate,inline,labelposition,labelwidth,
        showmessage,autocomplete,hiderequiredmark,labelcolon,disabled,ctrls,
        submitbtntext="提交",resetbtntext="重置"} 
        = 
        this.dataSource;
      return {formtitle,formdata,rulevalidate,inline,labelposition,labelwidth,showmessage,
        autocomplete,hiderequiredmark,labelcolon,disabled,ctrls,submitbtntext,resetbtntext}
    },
    methods:{
      validateHandler(prop, status, error){
        this.$emit("on-validate",prop, status, error)
      },
      validate(fn){
        this.$children[0].validate(fn)
      },
      validateField(datakey,fn){
        this.$children[0].validateField(datakey,fn)
      },
      resetFields(){
        this.$children[0].resetFields()
      },
      handleSubmit () {
        this.$emit("handle-submit")        
      },
      handleReset () {
        this.$emit("handle-reset")        
      }
    },
    watch:{
      dataSource: {
        handler: function (val, oldVal) { 
            this.formtitle = val.formtitle; 
            this.formdata = val.formdata; 
            this.rulevalidate = val.rulevalidate; 
            this.inline = val.inline; 
            this.labelposition = val.labelposition; 
            this.labelwidth = val.labelwidth; 
            this.showmessage = val.showmessage; 
            this.autocomplete = val.autocomplete; 
            this.hiderequiredmark = val.hiderequiredmark; 
            this.labelcolon = val.labelcolon; 
            this.disabled = val.disabled; 
            this.ctrls = val.ctrls; 
            this.submitbtntext = val.submitbtntext; 
            this.resetbtntext = val.resetbtntext; 
        },
        deep: true
      },
    },
    template:`
      <div>
        <h4 v-if="formtitle" class="form-title">{{formtitle}}</h4>
        <i-form 
          :model="formdata" 
          :rules="rulevalidate" 
          :inline="inline" 
          :label-position="labelposition"
          :label-width="labelwidth"
          :show-message="showmessage"
          :autocomplete="autocomplete"
          :hide-required-mark="hiderequiredmark"
          :label-colon="labelcolon"
          :disabled="disabled"
          @on-validate="validateHandler"
        >
          <template v-for="(item,index) in ctrls">
            <FormItem 
              v-if="item.length===1" 
              :prop="item[0].datakey"
              :label="item[0].label" 
              :label-width="item[0].labelwidth" 
              :label-for="item[0].labelfor"
              :required="item[0].required"
              :rules="item[0].rulevalidate"
              :error="item[0].errorinfo"
              :show-message="item[0].showmessage"
            >
              <span v-if="item[0].slotlabel" slot="label" v-html="item[0].slotlabel"></span>
              <Input v-if="['Input','input','text'].includes(item[0].type)" :element-id="item[0].id" v-model="formdata[item[0].datakey]" :placeholder="item[0].placeholder" :style="item[0].style"></Input>
              <Input type="textarea" v-else-if="['Textarea','textarea'].includes(item[0].type)" :element-id="item[0].id" v-model="formdata[item[0].datakey]" :placeholder="item[0].placeholder" :style="item[0].style"></Input>
              <Radio v-else-if="item[0].type === 'Radio'&&!item[0].source" v-model="formdata[item[0].datakey]">
                <Icon v-if="item[0].icon" :type="item[0].icon"></Icon>  
                {{item[0].name}}
              </Radio>
              <RadioGroup v-else-if="item[0].type === 'Radio'&&item[0].source" v-model="formdata[item[0].datakey]">
                <Radio v-for="(itemRadio,indexRadio) in item[0].source" :key="indexRadio" :label="itemRadio.value">
                  <Icon v-if="itemRadio.icon" :type="itemRadio.icon"></Icon>
                  <span>{{itemRadio.name}}</span>
                </Radio>
              </RadioGroup>
              <Select v-else-if="['Select','select'].includes(item[0].type)" v-model="formdata[item[0].datakey]" :style="item[0].style">
                <Option v-for="(itemSelect,indexSelect) in item[0].source" :value="itemSelect.value" :key="itemSelect.value">{{ itemSelect.name||itemSelect.label }}</Option>
              </Select>
              <Cascader v-else-if="['Cascader','cascader'].includes(item[0].type)" :data="item[0].source" v-model="formdata[item[0].datakey]" :style="item[0].style"></Cascader>
              <Checkbox v-else-if="item[0].type === 'Checkbox'&&!item[0].source" v-model="formdata[item[0].datakey]">{{item[0].name}}</Checkbox>
              <CheckboxGroup v-else-if="item[0].type === 'Checkbox'&&item[0].source" v-model="formdata[item[0].datakey]">
                  <Checkbox v-for="(itemCheckbox,indexCheckbox) in item[0].source" :key="indexCheckbox" :label="itemCheckbox.value">{{ itemCheckbox.name }}</Checkbox>
              </CheckboxGroup>
              <DatePicker v-else-if="['DatePicker','datePicker','datepicker'].includes(item[0].type)" :type="item[0].ctrltype" :placeholder="item[0].placeholder" v-model="formdata[item[0].datakey]"></DatePicker>
              <TimePicker v-else-if="['TimePicker','timePicker','timepicker'].includes(item[0].type)" :type="item[0].ctrltype" :placeholder="item[0].placeholder" v-model="formdata[item[0].datakey]"></TimePicker>
            </FormItem>
            <div v-else class="form-item-group">
              <FormItem 
                v-for="(itemGroup,indexGroup) in item" 
                :key="indexGroup"
                :prop="itemGroup.datakey"
                :label="itemGroup.label" 
                :label-width="itemGroup.labelwidth" 
                :label-for="itemGroup.labelfor"
                :required="itemGroup.required"
                :rules="itemGroup.rulevalidate"
                :error="itemGroup.errorinfo"
                :show-message="itemGroup.showmessage"
              >
                <span v-if="itemGroup.slotlabel" slot="label" v-html="itemGroup.slotlabel"></span>
                <Input v-if="['Input','input','text'].includes(itemGroup.type)" :element-id="itemGroup.id" v-model="formdata[itemGroup.datakey]" :placeholder="itemGroup.placeholder" :style="itemGroup.style"></Input>
                <Input type="textarea" v-else-if="['Textarea','textarea'].includes(itemGroup.type)" :element-id="itemGroup.id" v-model="formdata[itemGroup.datakey]" :placeholder="itemGroup.placeholder" :style="itemGroup.style"></Input>
                <Radio v-else-if="itemGroup.type === 'Radio'&&!itemGroup.source" v-model="formdata[itemGroup.datakey]">
                  <Icon v-if="itemGroup.icon" :type="itemGroup.icon"></Icon>   
                  {{itemGroup.name}}
                </Radio>
                <RadioGroup v-else-if="itemGroup.type === 'Radio'&&itemGroup.source" v-model="formdata[itemGroup.datakey]">
                  <Radio v-for="(itemRadio,indexRadio) in itemGroup.source" :key="indexRadio" :label="itemRadio.value">
                    <Icon v-if="itemRadio.icon" :type="itemRadio.icon"></Icon>
                    <span>{{itemRadio.name}}</span>
                  </Radio>
                </RadioGroup>
                <Select v-else-if="['Select','select'].includes(itemGroup.type)" v-model="formdata[itemGroup.datakey]" :style="itemGroup.style">
                  <Option v-for="(itemSelect,indexSelect) in itemGroup.source" :value="itemSelect.value" :key="itemSelect.value">{{ itemSelect.name||itemSelect.label }}</Option>
                </Select>
                <Cascader v-else-if="['Cascader','cascader'].includes(itemGroup.type)" :data="itemGroup.source" v-model="formdata[itemGroup.datakey]" :style="itemGroup.style"></Cascader>
                <Checkbox v-else-if="itemGroup.type === 'Checkbox'&&!itemGroup.source" v-model="formdata[itemGroup.datakey]">{{itemGroup.name}}</Checkbox>
                <CheckboxGroup v-else-if="itemGroup.type === 'Checkbox'&&itemGroup.source" v-model="formdata[itemGroup.datakey]">
                    <Checkbox v-for="(itemCheckbox,indexCheckbox) in itemGroup.source" :key="indexCheckbox" :label="itemCheckbox.value">{{ itemCheckbox.name }}</Checkbox>
                </CheckboxGroup>
                <DatePicker v-else-if="['DatePicker','datePicker','datepicker'].includes(itemGroup.type)" :type="itemGroup.ctrltype" :placeholder="itemGroup.placeholder" v-model="formdata[itemGroup.datakey]"></DatePicker>
                <TimePicker v-else-if="['TimePicker','timePicker','timepicker'].includes(itemGroup.type)" :type="itemGroup.ctrltype" :placeholder="itemGroup.placeholder" v-model="formdata[itemGroup.datakey]"></TimePicker>
              </FormItem>
            </div>          
          </template>
          <FormItem v-if="submitbtntext||resetbtntext">
            <Button v-if="submitbtntext" type="primary" @click="handleSubmit">{{submitbtntext}}</Button>
            <Button v-if="resetbtntext" @click="handleReset" style="margin-left: 8px">{{resetbtntext}}</Button>
          </FormItem>
        </i-form>
      </div>
    `
})
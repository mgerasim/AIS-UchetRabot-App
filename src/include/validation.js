import { extend } from 'vee-validate';
import { required, min_value } from 'vee-validate/dist/rules';

extend('required', {
    ...required,
    message: 'Поле {_field_} обязательно для заполнения'
  });
  
  extend('min_value', {
    ...min_value,
    message: `Значение '{_field_}' должно быть не меньше {min}`
  });
  
  extend('minLength', {
    params: ['min'], // list of parameter names
    validate(value, { min }) {
      if(value == null) return false;
      if(value.length == null) return false;
      return value.length >= Number(min);
    }
  });
  
  extend('minMaskLength', {
    params: ['min', 'systems'], // list of parameter names
    validate(value, { min, systems }) {
      if(value == null) return false;
      if(value.length == null) return false;
      let masks = value.flatMap(p => p.Items);
      return masks.filter(p => systems.includes(p.Mask.System.Name)).length >= Number(min);
    }
  });
  
  extend('custom', {
    params: ['validate'], // list of parameter names
    validate(value, { validate }) {
      console.log('custom rule');
      return validate(value);
    }
  });
  
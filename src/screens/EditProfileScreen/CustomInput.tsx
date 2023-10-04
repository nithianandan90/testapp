import {Control, Controller} from 'react-hook-form';
import {Text, TextInput, View} from 'react-native';
import styles from './styles';
import colors from '../../theme/colors';
import {User} from '../../API';

type IEditableUserField = 'name' | 'username' | 'website' | 'bio';

type IEditableUser = Pick<User, IEditableUserField>;

interface ICustomInput {
  label: string;
  multiline?: boolean;
  control: Control<IEditableUser, object>;
  name: IEditableUserField;
  rules?: object;
}

const CustomInput = ({
  name,
  control,
  label,
  multiline = false,
  rules = {},
}: ICustomInput) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={{flex: 1}}>
              <TextInput
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={label}
                style={[
                  styles.input,
                  {borderColor: error ? colors.error : colors.border},
                ]}
                multiline={multiline}
              />
              {error && (
                <Text style={{color: colors.red}}>
                  {error.message || 'Error'}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
};

export default CustomInput;

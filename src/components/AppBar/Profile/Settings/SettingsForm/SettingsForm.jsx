import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import { Notify } from 'notiflix';

import { FiEyeOff, FiEye } from 'react-icons/fi';
import { RiSave3Fill } from 'react-icons/ri';

import { useUpdateUserDataMutation } from 'redux/authAPI';
import { setUser } from 'redux/authSlice';

import { passwordRegExp } from 'components/shared/RegExps';

import Button from 'components/shared/button/Button';
import IconButton from 'components/shared/button/IconButton';
import { Box, FormBox } from '../Settings.styled';
import {
  InputBox,
  InputField,
  Label,
  Error,
} from 'components/shared/Input/Input.styled';
import { PasswordInputBox } from 'components/shared/Input/PasswordInput/PasswordInput.styled';

const ValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .test('notEmpty', 'Cannot be empty', function (value) {
      return this.parent.name || value !== undefined;
    })
    .min(3, 'Must be at least 3 characters')
    .max(20, 'Must be max 20 characters'),
  email: Yup.string()
    .test('notEmpty', 'Cannot be empty', function (value) {
      return this.parent.name || value !== undefined;
    })
    .email('Must be valid email'),
  password: Yup.string()
    // .test('notEmpty', 'Cannot be empty', function (value) {
    //   return this.parent.name || value !== undefined;
    // })
    .min(8, 'Must be at least 8 characters')
    .max(16, 'Must be max 16 characters')
    .matches(
      passwordRegExp,
      'Must be at least one capital letter and one number'
    ),

  confirmPassword: Yup.string()
    .test(
      'additionalField-required',
      'Password confirm required',
      function (value) {
        if (this.parent.password && this.parent.password.length > 0) {
          return value && value.length > 0;
        }
        return true;
      }
    )
    .oneOf([Yup.ref('password'), null], 'Passwords must match!'),
});

const SettingsForm = ({ setShowModal, user }) => {
  const [formState, setFormState] = useState({
    fullName: user.fullName,
    email: user.email,
    password: '',
    confirmPassword: '',
  });

  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (!user._id) return;

    const { email, fullName } = user;
    setFormState(prev => ({ ...prev, fullName, email }));
  }, [user]);

  const initialValues = {
    fullName: formState.fullName,
    email: formState.email,
    password: formState.password,
    confirmPassword: formState.confirmPassword,
  };

  const dispatch = useDispatch();

  const [updateUserData, { isLoading, isSuccess, isError, error }] =
    useUpdateUserDataMutation();

  const handleSubmit = async data => {
    const { data: userData } = await updateUserData(data);
    dispatch(setUser(userData.user));
  };

  const handleFieldChange = e =>
    setFormState(prev => ({ ...prev, [e.target.id]: e.target.value }));

  useEffect(() => {
    if (isSuccess) {
      Notify.success('Data successfully saved', {
        showOnlyTheLastOne: true,
        position: 'right-bottom',
      });
    }

    if (isError) {
      Notify.failure(error.data.message, {
        showOnlyTheLastOne: true,
        position: 'right-bottom',
      });
    }

    if (!isLoading && isSuccess) {
      setShowModal(false);
    }
  }, [error, isError, isLoading, isSuccess, setShowModal]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values, { resetForm }) => {
        const userData = values => {
          const { confirmPassword, password, ...data } = values;

          if (password === '') return data;

          return { ...data, password };
        };

        handleSubmit(userData(values));
        resetForm();
      }}
    >
      {({ setFieldValue }) => (
        <Box>
          <FormBox>
            <InputBox>
              <Label htmlFor="fullName">Full name</Label>
              <InputField
                id="fullName"
                name="fullName"
                type="text"
                placeholder="First & last name"
                onChange={e => {
                  setFieldValue('fullName', e.target.value.trim());
                  handleFieldChange(e);
                }}
                value={formState.fullName}
              />
              <ErrorMessage name="fullName" component={Error} />
            </InputBox>

            <InputBox>
              <Label htmlFor="email">Email</Label>
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                onChange={e => {
                  setFieldValue('email', e.target.value.trim());
                  handleFieldChange(e);
                }}
                value={formState.email}
              />
              <ErrorMessage name="email" component={Error} />
            </InputBox>

            <PasswordInputBox>
              <InputBox>
                <Label htmlFor="password">Password</Label>
                <InputField
                  id="password"
                  name="password"
                  type={passwordVisible.password ? 'text' : 'password'}
                  placeholder="********"
                  onChange={e => {
                    setFieldValue('password', e.target.value.trim());
                    handleFieldChange(e);
                  }}
                  value={formState.password.trim()}
                />
                <ErrorMessage name="password" component={Error} />
              </InputBox>
              <IconButton
                icon={passwordVisible.password ? FiEye : FiEyeOff}
                iconSize={24}
                onClick={() =>
                  setPasswordVisible(prev => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                round
              />
            </PasswordInputBox>

            <PasswordInputBox>
              <InputBox>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <InputField
                  id="confirmPassword"
                  name="confirmPassword"
                  type={passwordVisible.confirmPassword ? 'text' : 'password'}
                  placeholder="********"
                  onChange={e => {
                    setFieldValue('confirmPassword', e.target.value.trim());
                    handleFieldChange(e);
                  }}
                  value={formState.confirmPassword}
                />
                <ErrorMessage name="confirmPassword" component={Error} />
              </InputBox>
              <IconButton
                icon={passwordVisible.confirmPassword ? FiEye : FiEyeOff}
                iconSize={24}
                onClick={() =>
                  setPasswordVisible(prev => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
                round
              />
            </PasswordInputBox>
          </FormBox>
          <Button
            type="submit"
            isLoading={isLoading}
            icon={RiSave3Fill}
            disabled={isLoading}
          >
            Save
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default SettingsForm;

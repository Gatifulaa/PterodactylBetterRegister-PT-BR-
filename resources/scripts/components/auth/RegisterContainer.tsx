import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import register from '@/api/auth/register';
import RegisterFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    email: string;
    username: string;
    firstname: string;
    lastname: string;
	password: string;
}

const RegisterContainer = () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        register({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    addFlash({
                        type: 'success',
                        title: 'Success',
                        message: 'Você foi registrado com sucesso!',
                    });
					
					setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 1000);

                    setSubmitting(false);
                }
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                const data = JSON.parse(error.config.data);

                if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*[a-zA-Z0-9]$/.test(data.username))
                    error =
                        'O nome de usuário deve começar e terminar com uma letra ou número e conter apenas, hífens, sublinhados e pontos.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) error = 'Por favor forneça um endereço de email válido.';

                setSubmitting(false);
                if (typeof error === 'string') {
                    addFlash({
                        type: 'error',
                        title: 'Error',
                        message: error || '',
                    });
                } else {
                    clearAndAddHttpError({ error });
                }
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ email: '', username: '', firstname: '', lastname: '', password: '' }}
            validationSchema={object().shape({
                email: string().required('Por favor, forneça um endereço de email.'),
                username: string().required('Por favor forneça um nome de usuário.'),
                firstname: string().required('Por favor forneça seu primeiro nome.'),
                lastname: string().required('Por favor forneça seu último nome.'),
				password: string().required('Você precisa definir uma senha.').min(8, 'A senha precisa ter no mínimo 8 caracteres.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <RegisterFormContainer title={'Registrar-se'} css={tw`w-full flex`}>
                    <Field
                        type={'email'}
                        label={'Endereço de email'}
                        name={'email'}
                        disabled={isSubmitting}
                    />
                    <div css={tw`mt-6`}>
                        <Field
                            type={'text'}
                            label={'Nome de usuário'}
                            name={'username'}
                            disabled={isSubmitting}
                        />
                    </div>
					<div css={tw`md:flex md:space-x-4`}>
						<div css={tw`mt-6 flex-1`}>
							<Field
								type={'text'}
								label={'Primeiro nome'}
								name={'firstname'}
								disabled={isSubmitting}
							/>
						</div>
						<div css={tw`mt-6 flex-1`}>
							<Field
								type={'text'}
								label={'Último nome'}
								name={'lastname'}
								disabled={isSubmitting}
							/>
						</div>
					</div>
					<div css={tw`mt-6`}>
						<Field
							type={'password'}
							label={'Senha'}
							name={'password'}
							disabled={isSubmitting}
						/>
					</div>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            Registrar
                        </Button>
                    </div>

                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
                        >
                            Já tem uma conta?
                        </Link>
                    </div>
                </RegisterFormContainer>
            )}
        </Formik>
    );
};

export default RegisterContainer;

import * as yup from "yup";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { Footer } from "../../components/Footer";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";

import logo from "../../assets/logo-yellow.png";
import signInImg from "../../assets/signin-img.png";
import { EnvelopeSimple, Lock, SignOut } from "phosphor-react";

import styles from "./styles.module.scss";
import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";

interface IFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().required("Email obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

export function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: IFormInputs) => {
      try {
        await signIn({
          email: data.email,
          password: data.password,
        });

        addToast({
          type: "success",
          title: "Login realizado com sucesso",
        });

        navigate("/");
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro na auntenticação",
          description:
            "Ocorreu um erro ao fazer o login, cheque as credencias.",
        });
      }
    },
    [navigate, signIn, addToast],
  );

  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.content}>
        <div className={styles.login}>
          <NavLink to="/">
            <img src={logo} alt="" />
          </NavLink>

          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Faça seu Logon</h1>

            <div>
              <InputField
                icon={EnvelopeSimple}
                placeholder="Email"
                errorMessage={errors.email?.message}
                register={register("email")}
              />

              <InputField
                icon={Lock}
                type="password"
                placeholder="Senha"
                errorMessage={errors.password?.message}
                register={register("password")}
              />
            </div>

            <button type="submit" title="Entrar">
              Entrar
            </button>
            <Link to="/reset-password">Esqueci Minha Senha</Link>
          </form>

          <Link to="/signup" className={styles.signup}>
            <SignOut />
            Criar Conta
          </Link>
        </div>

        <div className={styles.image}>
          <img
            src={signInImg}
            title="Autor: Iryna Zaichenko"
            aria-label="Autor: Iryna Zaichenko"
            alt="Cão com pelagem amarela e branca"
          />
          <a
            href="https://thumbs.dreamstime.com/b/mesti%C3%A7o-de-boxador-entre-o-labrador-boxer-dog-watercolor-ilustra%C3%A7%C3%A3o-arte-digital-fofo-com-um-retrato-comprimento-total-251573403.jpg"
            target="_blank"
            rel="noreferrer"
          >
            Iryna Zaichenko
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { SIGN_UP } from '../client_hooks/users';
import { useMutation } from '@apollo/client';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

const Error = styled.p`
  color: red;
`;

const useStyles = makeStyles((theme) => ({
  background: {
    height: '100vh',
    display: 'flex',
    backgroundColor: '#4527A0',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Data {
  name: string;
  email: string;
  pass: string;
  confirm_pass: string;
}

export default function SignUp() {
  const [cookies, setCookie] = useCookies(['token']);
  const router = useRouter();
  useEffect(() => {
    cookies['token'] && router.push('/');
  }, [cookies]);
  const [sign_up] = useMutation(SIGN_UP, {
    update: (_proxy, response) => {
      if (response.data.sign_up) {
        console.log(response.data.sign_up);
        setCookie('token', response.data.sign_up.token);
      } else {
        alert('サインアップが失敗しました。');
      }
    },
  });
  const classes = useStyles();
  const { register, handleSubmit, errors, getValues } = useForm<Data>();

  const emailReg = new RegExp(
    '^([a-zA-Z0-9])+([a-zA-Z0-9_-])*@([a-zA-Z0-9._-])+([a-zA-Z0-9._-]+)+$'
  );
  const passReg = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
  );
  const signup_submit = async (data: Data) => {
    try {
      await sign_up({
        variables: {
          name: data.name,
          email: data.email,
          password: data.pass,
        },
      });
      location.replace('/');
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div className={classes.background}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{ color: '#fff' }}>
            Proshare
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(signup_submit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  style={{ backgroundColor: '#fff' }}
                  name="name"
                  variant="filled"
                  inputRef={register({ required: '名前を入力してください' })}
                  fullWidth
                  label={<span>お名前</span>}
                />
                {errors.name && <Error>{errors.name.message}</Error>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  style={{ backgroundColor: '#fff' }}
                  variant="filled"
                  fullWidth
                  label={<span>メールアドレス</span>}
                  name="email"
                  inputRef={register({
                    required: 'メールアドレス入力してください',
                    pattern: {
                      value: emailReg,
                      message: '正しいメールアドレスを入力してください',
                    },
                  })}
                />
                {errors.email && <Error>{errors.email.message}</Error>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  style={{ backgroundColor: '#fff' }}
                  variant="filled"
                  fullWidth
                  name="pass"
                  label={<span>パスワード</span>}
                  type="password"
                  inputRef={register({
                    required: 'パスワードを入力してください',
                    pattern: {
                      value: passReg,
                      message:
                        'パスワードは6文字以上かつ１つの小文字と１つの大文字のアルファベット文字、１つの英数字を含む必要性があります。',
                    },
                  })}
                />
                {errors.pass && <Error>{errors.pass.message}</Error>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  style={{ backgroundColor: '#fff' }}
                  variant="filled"
                  fullWidth
                  name="confirm_pass"
                  label={<span>確認用パスワード</span>}
                  type="password"
                  inputRef={register({
                    required: '確認用パスワードを入力してください',
                    validate: (value) => {
                      if (value === getValues()['pass']) {
                        return true;
                      } else {
                        return 'パスワードと一致しません';
                      }
                    },
                  })}
                />
                {errors.confirm_pass && (
                  <Error>{errors.confirm_pass.message}</Error>
                )}
              </Grid>
            </Grid>
            <Button
              style={{ backgroundColor: ' #EDE7F6', color: '#000' }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              新規登録
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  onClick={() => {
                    router.push('/signin');
                  }}
                  variant="body2"
                  style={{ color: '#E5E5E5', cursor: 'pointer' }}
                >
                  もうすでにアカウントをお持ちですか？ サインイン
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}

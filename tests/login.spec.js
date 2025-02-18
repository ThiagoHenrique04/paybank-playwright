import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

import { cleanJobs, getJob } from '../support/redis';

test('Deve acessar a conta do usuario - Fluxo Principal', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const user = {
    cpf: '00000014141',
    senha: '147258'
  }
  
    await cleanJobs()

    await loginPage.acessaPagina()  
    await loginPage.informaCpf(user.cpf)
    await loginPage.informaSenha(user.senha)

    await page.getByRole('heading', {name: 'Verificação em duas etapas'})
    .waitFor({timeout: 3000})
    
    // const codigo = await getJob()
  
    const codigo = await obterCodigo2FA(user.cpf)

    await loginPage.informa2FA(codigo)

    await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
  });

  
test('Não deve logar com o codigo de autenticação invalido', async ({ page }) => {

  const loginPage = new LoginPage(page)

  const user = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.acessaPagina()  
  await loginPage.informaCpf(user.cpf)
  await loginPage.informaSenha(user.senha)
  await loginPage.informa2FA('123456')

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});


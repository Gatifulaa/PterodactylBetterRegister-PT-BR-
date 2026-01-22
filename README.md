# Módulo de Registro PT-BR

## Módulo de registro para painel Pterodactyl 1.1x.x
- *Baseado no módulo de registro de VertisanPro/PterodactylRegister*

Antes de continuar, certifique-se que está usando a versão 1.11.11+ para continuar a instalação.
Para começar a usar o módulo de registro, escolha um dos métodos de instalação entre o automático e o modo manual.

---

### Instalação automática (recomendado)

  1. Tenha certeza que está no diretório padrão do pterodactyl usando: ``cd /var/www/pterodactyl``
  2. Baixe o instalador do módulo: ``composer require gatifulaa/betterregister``
  3. Rode o instalador: ``php artisan register:install``

---

### Instalação manual (para modificações)
  1. Use SFTP e de upload em todas as pastas dentro do seu diretório padrão do pterodactyl:  ``/var/www/pterodactyl``

  2. Vá para ``resources/scripts/components/auth/LoginContainer.tsx`` e ache a linha ``</LoginFormContainer>`` no arquivo, e antes dessa linha cole o código abaixo:
```
<div css={tw`mt-6 text-center`}>
    <Link
        to={'/auth/register'}
        css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase`}
    >
        Não tem uma conta?
    </Link>
</div>
```
  3. Siga a documentação oficial para aplicar as mudanças: https://pterodactyl.io/community/customization/panel.html

---

### E pronto! Na sua página de login já terá um botão para criar uma conta no painel.

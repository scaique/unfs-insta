# Unfollowers for Instagram
 
App Android para descobrir quem você segue no Instagram, mas não te segue de volta. Ele usa os arquivos que o próprio Instagram exporta. Nada é enviado para a internet: tudo fica salvo no seu aparelho.
 
## Como usar
 
1. **Baixe seus dados no Instagram**
   No Instagram, abra a opção de exportar suas informações (Central de Contas > Suas informações e permissões > Exportar suas informações), escolha **Seguidores e seguindo**, Intervalo de datas **Desde o início** e o formato **JSON**. Quando o arquivo ficar pronto, baixe e extraia o zip.
2. **Pegue os dois arquivos**
   Dentro da pasta extraída, em `connections/followers_and_following/`:
   - `following.json` (quem você segue)
   - `followers_1.json` (quem te segue)
   Se existir também `followers_2.json`, `followers_3.json` etc., selecione todos juntos no campo de seguidores. Se usar só o primeiro, alguns seguidores aparecem como "não segue de volta" por engano.
3. **Envie os arquivos no app**
   Escolha cada arquivo nos dois campos. O app só aceita `.json` e confere se a estrutura é a oficial do Instagram. O botão **Começar análise** só fica ativo quando os dois estiverem válidos.
4. **Veja o resultado**
   - **Quem não me segue:** lista completa de quem não te segue de volta.
   - **Novos que não me seguem:** a partir da segunda análise, mostra só quem apareceu desde a análise anterior.
   - Toque em um perfil para abrir no Instagram.
   - Contas deletadas não aparecem na lista, mas o app avisa quantas foram encontradas.
5. **Whitelist**
   Em qualquer card, toque em **Whitelist** para tirar o perfil da lista (por exemplo, páginas e pessoas que você quer seguir mesmo sem retorno). Quem está na whitelist não aparece nas próximas análises. Para voltar a ver o perfil, remova-o na tela **Whitelist**.
A lista fica salva no aparelho. Para atualizar, baixe um export novo do Instagram e faça outra análise.
 
## Limitações conhecidas
 
- **Contas desativadas, suspensas ou banidas aparecem como "não segue de volta".** O export do Instagram continua listando essas contas em `following.json`, e como elas não estão em `followers`, o app as mostra na lista. Só as contas deletadas de vez vêm marcadas como `__deleted__` e são filtradas. O app não consegue identificar as demais sozinho, e não encontrei um jeito de contornar isso por enquanto.

## Para desenvolver
 
```
npm install
npx expo start
```
 
Para gerar o APK:
 
```
npm run apk-local   # build local (precisa do Android SDK e JDK 17)
npm run apk         # build na nuvem do EAS
```
 
Stack: Expo, Expo Router, TypeScript e AsyncStorage.

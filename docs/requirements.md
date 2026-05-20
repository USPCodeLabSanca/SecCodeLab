# Requisitos de todo o projeto

## Requisitos da aplicações vulneráveis

- Cada aplicação vulnerável deve estar disponível na página da explicação sobre a vulnerabilidade correspondente;
- Deve ser facilmente instanciável pelo usuário;
- As instâncias devem rodar em ambientes isolados da máquina do usuário;
- Cada aplicação deve ter um **objetivo**: Isto é vulnerabilidade que o backend malicioso consegue testar e que o usuário precisa corrigir;
- Elas devem possuir um módulo de teste que iniciará uma comunicação com o backend malicioso, o qual deve ser capaz de testar a vulnerabilidade; Quando a natureza da vulnerabilidade permitir, o backend deve dizer se o teste foi bem sucedido (isto é, ele conseguiu explorar a falha e, portanto, a aplicação ainda está vulnerável);
- O código, formato ou tecnologia de cada aplicação deve contemplar o que for necessário para a vulnerabilidade realmente existir e ser corrigido (por exemplo, ela precisaria instanciar uma base de dados para vulnerabilidades de SQL, ou um fornt-end HTML para XSS);
- Aplicações diferentes podem usar códigos e tecnologias diferentes.


## Requisitos do Backend hacker

- Deve possuir uma rota de teste específica para cada aplicação vulnerável;
- Deve ser capaz de interagir com essa aplicação que o usuário instanciou na máquina local (recebendo e enviando requisições);
- Deve ser minimamente otimizado para que vários usuários simultâneos não quebrem o sistema;
- Deve ter o mínimo de estados possível para evitar problemas de segurança


## Requisitos da página de ensinos

- Deve ser composta de uma página que explique o projeto;
- Nessa mesma página deve haver um tutorial para o usuário aprender a instanciar as aplicações e qual deve ser a sua abordagem para resolver as atividades (isto é, explicar que o objetivo é entender a vulnerabilidade e mudar o código até que ela fique segura);
- Deve possibilitar a criação de novos artigos sobre novas vulnerabilidades;
- Cara artigo deve possuir um link para baixar o código da aplicação vulnerável (atividade para o usuário treinar os conceitos de desenovlvimento seguro);
- O artigo deve possuir soluções sobre a vulnerabilidade;

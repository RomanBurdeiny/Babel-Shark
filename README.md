# Запуск проекта для проверки на Windows

## Что нужно

Перед запуском убедитесь, что у вас установлены:

- Node.js 20+ (для npm)
- Meteor 3.x (CLI в PATH или используйте tools\run-meteor.cmd)
- Docker Desktop (для MySQL)

---

## Порядок запуска

### 1. Откройте проект

Клонируйте или распакуйте проект и перейдите в папку:

babel-shark

---

### 2. Поднимите MySQL через Docker

Выполните в корне проекта:

docker compose up -d

Дождитесь, пока контейнер mysql будет в статусе Running.

Проверить можно командой:

docker compose ps

---

### 3. Выдайте права (один раз)

Если база уже существовала, выполните:

docker compose exec mysql mysql -uroot -proot -e "GRANT REPLICATION CLIENT, REPLICATION SLAVE ON *.* TO 'babel_shark'@'%'; FLUSH PRIVILEGES;"

---

### 4. Проверьте settings.json

Убедитесь, что в корне есть файл settings.json с параметрами:

- host: 127.0.0.1
- port: 3306
- database: babel_shark
- user: babel_shark

---

### 5. Установите зависимости

Если meteor доступен:

meteor npm install

Если нет:

tools\run-meteor.cmd npm install

---

### 6. Запустите приложение

npm start

(внутри используется meteor run --settings settings.json)

---

### 7. Откройте в браузере

http://localhost:3000

---

## Что должно работать

На странице должна быть таблица:

- ID
- Full name
- Position

В колонке Position:

1. Сначала значения из MySQL:
   - offiecer
   - manager
   - operator

2. Затем после работы MutationObserver и вызова:
   Meteor.call('translate')

   значения заменяются на:
   - офицер
   - менеджер
   - оператор

---

## Если не работает

### ECONNREFUSED 127.0.0.1:3306

MySQL не запущен или порт занят.

Проверьте:

docker compose ps

---

### Ошибка прав (SHOW BINARY LOGS / REPLICATION CLIENT)

Повторите шаг с выдачей прав (шаг 3).

---

### Нет зависимостей (@babel/runtime, jquery)

Повторите:

meteor npm install

или:

tools\run-meteor.cmd npm install

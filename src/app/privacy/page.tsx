"use client";

import { useTheme } from "@/src/lib/ThemeContext";
import { 
  Shield, 
  Eye, 
  Database, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Lock, 
  Cookie, 
  Bell, 
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Server,
  Users,
  Calendar,
  Clock,
  Globe,
  Gavel
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const { isDark } = useTheme();

  return (
    <div className="p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Политика конфиденциальности
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            для веб-приложения «МойБонч»
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Актуально на: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-3 shrink-0">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Оператор
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Самозанятый Савкин Михаил Григорьевич
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                ИНН: __________ | Адрес регистрации: __________
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Email: __________</span>
                <span className="text-gray-600 dark:text-gray-400">Telegram: @miphhhh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm space-y-8">

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                1. Общие положения
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>1.1. Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей веб-приложения «МойБонч» (далее — «Сервис»).</p>
              <p>1.2. Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» (с изменениями, вступившими в силу в 2025 году) и действует в отношении всех данных, которые Оператор может получить о пользователях Сервиса.</p>
              <p>1.3. Используя Сервис и проходя регистрацию, пользователь дает согласие на обработку своих персональных данных в порядке, предусмотренном настоящей Политикой и отдельной формой согласия (Приложение № 1).</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                2. Какие персональные данные мы собираем
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300 text-sm">2.1. В процессе использования Сервиса Оператор обрабатывает следующие данные:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Категория данных</th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Конкретный перечень</th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Основание обработки</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Регистрационные данные</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Имя пользователя, адрес электронной почты (email), пароль (в зашифрованном виде)</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Исполнение договора (ст. 6 152-ФЗ)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Технические данные</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">IP-адрес, тип устройства, тип браузера, данные файлов cookie</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Согласие пользователя</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Данные об использовании</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Данные о загружаемых файлах (размер, тип, дата загрузки), количество созданных заметок и задач</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Исполнение договора</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Платежные данные</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300" colSpan={2}>Оператор не собирает и не хранит данные банковских карт. Все платежи обрабатываются через ЮKassa в соответствии с их политикой конфиденциальности</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-3">2.2. Сервис не обрабатывает специальные категории персональных данных (раса, национальность, политические взгляды, религиозные или философские убеждения, состояние здоровья, интимная жизнь) и биометрические данные.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                3. Цели обработки персональных данных
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Цель обработки</th>
                    <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Какие данные используются</th>
                    <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Правовое основание</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Регистрация и авторизация в Сервисе</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Имя, email, пароль</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Исполнение договора</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Предоставление доступа к функциям Сервиса</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Имя, email</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Исполнение договора</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Обработка платежей (через ЮKassa)</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Email (для отправки чека)</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Исполнение договора</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Отправка уведомлений об окончании подписки</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Email</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Исполнение договора</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Техническая поддержка пользователей</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Имя, email, Telegram-аккаунт</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Согласие пользователя</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Улучшение работы Сервиса (аналитика)</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Обезличенные технические данные</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Согласие пользователя</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Gavel className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                4. Правовые основания обработки
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>4.1. Обработка персональных данных осуществляется на следующих основаниях:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-gray-900 dark:text-white">Исполнение договора (публичной оферты)</strong> — для данных, необходимых для регистрации, доступа к Сервису и обработки платежей. Согласно ст. 6 152-ФЗ, согласие не требуется, если обработка необходима для исполнения договора.</li>
                <li><strong className="text-gray-900 dark:text-white">Согласие пользователя</strong> — для технической поддержки через Telegram, аналитики и файлов cookie. С 1 сентября 2025 года такое согласие оформляется отдельным документом (см. Приложение № 1 к настоящей Политике).</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                5. Порядок получения согласия
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>5.1. При регистрации в Сервисе пользователь заполняет две отдельные формы:</p>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Форма 1. Согласие на обработку персональных данных для исполнения договора</p>
                  <p className="text-gray-600 dark:text-gray-400 italic">«Я согласен на обработку моих персональных данных (имя, email) для целей регистрации, доступа к Сервису и обработки платежей»</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Форма 2. Согласие на дополнительные цели обработки (опционально)</p>
                  <p className="text-gray-600 dark:text-gray-400 italic">«Я согласен на обработку моих персональных данных для целей технической поддержки через Telegram и сбора обезличенной аналитики»</p>
                </div>
              </div>
              
              <p>5.2. Каждая форма согласия содержит следующие обязательные реквизиты (в соответствии с требованиями с 1 сентября 2025 года):</p>
              <ul className="list-disc list-inside ml-4">
                <li>ФИО пользователя</li>
                <li>Адрес электронной почты</li>
                <li>Перечень персональных данных, на обработку которых даётся согласие</li>
                <li>Перечень действий с данными (сбор, хранение, обработка)</li>
                <li>Цель обработки по каждой форме</li>
                <li>Срок действия согласия</li>
                <li>Порядок отзыва согласия</li>
              </ul>
              
              <p>5.3. Галочки в формах согласия не могут быть предустановлены (требование закона о «добровольности и информированности»).</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                6. Сроки обработки и хранения
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>6.1. Персональные данные, обрабатываемые для исполнения договора, хранятся в течение всего срока использования Сервиса пользователем и удаляются в течение 30 дней после удаления аккаунта пользователем.</p>
              <p>6.2. Персональные данные, обрабатываемые на основании отдельного согласия (техподдержка, аналитика), хранятся в течение 1 года с момента дачи согласия или до его отзыва (в зависимости от того, что наступит раньше).</p>
              <p>6.3. Данные файлов cookie хранятся в соответствии с настройками браузера пользователя, но не более 12 месяцев.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                7. Передача персональных данных третьим лицам
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300 text-sm">7.1. Оператор не передаёт персональные данные пользователей третьим лицам, за исключением следующих случаев:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Получатель</th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Какие данные передаются</th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-white">Цель передачи</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">ЮKassa (платёжная система)</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Email пользователя, сумма платежа, идентификатор подписки</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Обработка платежей и отправка чеков</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Хостинг-провайдер (РФ)</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Все данные, хранящиеся в Сервисе</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Обеспечение работы Сервиса</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Правоохранительные органы</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">Данные в объёме, установленном законом</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">По законному запросу (ст. 14 152-ФЗ)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                  🔒 Важно: Все базы данных с персональными данными граждан РФ хранятся на серверах, физически расположенных на территории Российской Федерации (требование ст. 18 152-ФЗ о локализации данных).
                </p>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm">7.3. Оператор не осуществляет трансграничную передачу персональных данных.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                8. Права пользователей
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>8.1. Пользователь имеет право:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Получить информацию о том, какие его персональные данные обрабатываются (ответ в течение 10 рабочих дней)</li>
                <li>Требовать уточнения, блокирования или уничтожения своих персональных данных, если они неполные, устаревшие или обрабатываются незаконно</li>
                <li>Отозвать согласие на обработку персональных данных в любой момент</li>
                <li>Потребовать удаления аккаунта и всех связанных с ним данных</li>
              </ul>
              <p>8.2. Для реализации своих прав пользователь может направить запрос:</p>
              <ul className="list-disc list-inside ml-4">
                <li>По email: __________</li>
                <li>Через Telegram: @miphhhh</li>
                <li>Почтовым отправлением: [ваш адрес регистрации]</li>
              </ul>
              <p>8.3. Оператор обязан рассмотреть запрос и предоставить ответ в течение 10 рабочих дней (ст. 20 152-ФЗ).</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                9. Меры защиты персональных данных
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>9.1. Оператор принимает следующие меры для защиты персональных данных:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Шифрование паролей пользователей (хеширование)</li>
                <li>Использование SSL-сертификата для защиты передачи данных</li>
                <li>Регулярное резервное копирование баз данных</li>
                <li>Ограниченный доступ к персональным данным сотрудников (технический администратор)</li>
                <li>Назначение ответственного за обработку персональных данных (лично Оператор)</li>
              </ul>
              <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">
                  ⚠️ 9.2. В случае утечки персональных данных Оператор обязан:
                </p>
                <ul className="list-disc list-inside ml-4 text-yellow-800 dark:text-yellow-300 text-sm mt-1">
                  <li>Уведомить Роскомнадзор в течение 24 часов с момента обнаружения инцидента</li>
                  <li>Уведомить пострадавших пользователей в течение 72 часов</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Cookie className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                10. Файлы cookie
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>10.1. Сервис использует файлы cookie для обеспечения работы (технические cookie) и сбора обезличенной аналитики (аналитические cookie).</p>
              <p>10.2. При первом посещении сайта пользователь видит баннер с информацией об использовании cookie и может настроить их приём.</p>
              <p>10.3. Пользователь может отключить cookie в настройках браузера, но это может повлиять на работу некоторых функций Сервиса.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                11. Изменение Политики
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>11.1. Оператор вправе вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента её размещения на сайте по адресу https://my-bonch-app.vercel.app/privacy.</p>
              <p>11.2. Оператор уведомляет пользователей об изменениях по email за 14 дней до их вступления в силу.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                12. Заключительные положения
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>12.1. Настоящая Политика регулируется законодательством Российской Федерации.</p>
              <p>12.2. Споры рассматриваются по месту нахождения Оператора (г. Санкт-Петербург).</p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
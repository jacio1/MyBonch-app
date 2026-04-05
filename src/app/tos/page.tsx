"use client";

import { useTheme } from "@/src/lib/ThemeContext";
import { FileText, Calendar, CreditCard, Shield, AlertCircle, RefreshCw, Gavel, Clock, Download, Trash2, Edit, Image, FileText as FileDoc, Phone, Mail as MailIcon, MapPin, User, Lock, Eye, Database, Bell } from "lucide-react";
import Link from "next/link";

export default function OfferPage() {
  const { isDark } = useTheme();

  return (
    <div className="p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Публичная оферта
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            О предоставлении доступа к веб-приложению «МойБонч»
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Актуально на: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        {/* Executor Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-3 shrink-0">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Исполнитель
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Самозанятый Савкин Михаил Григорьевич
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                ИНН: __________ | Адрес регистрации: __________
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Section 1 - Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                1. Термины
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p><strong className="text-gray-900 dark:text-white">Сервис</strong> — веб-приложение «МойБонч» (расписание, задачи, заметки, вложения).</p>
              <p><strong className="text-gray-900 dark:text-white">Пользователь</strong> — любое дееспособное лицо, принявшее Оферту.</p>
              <p><strong className="text-gray-900 dark:text-white">Подписка</strong> — платный доступ к расширенным возможностям Сервиса на 1 месяц.</p>
              <p><strong className="text-gray-900 dark:text-white">Акцепт</strong> — полное и безоговорочное принятие Оферты.</p>
            </div>
          </section>

          {/* Section 2 - Subject */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                2. Предмет договора
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>2.1. Исполнитель предоставляет Пользователю доступ к Сервису на условиях простой (неисключительной) лицензии.</p>
              <p>2.2. Доступ возможен в двух вариантах:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Бесплатный (с ограничениями)</li>
                <li>Платная Подписка — <span className="font-bold text-indigo-600 dark:text-indigo-400">99 руб./мес</span></li>
              </ul>
            </div>
          </section>

          {/* Section 3 - Acceptance */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                3. Акцепт (как заключается договор)
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>Договор считается заключенным с момента:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Регистрации на Сайте (email, имя, пароль)</li>
                <li>Подтверждения email (переход по ссылке из письма)</li>
                <li>Оплаты Подписки через ЮKassa</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">
                  👉 Нажатие кнопки «Оплатить» означает полное согласие с Офертой.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 - Features */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                4. Функционал и ограничения
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">4.1. Общий функционал (всем пользователям)</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <li>Расписание пар</li>
                  <li>Список задач</li>
                  <li>Заметки с вложениями (изображения, текстовые документы)</li>
                  <li>Пресеты для пар и их загрузка в расписание</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">4.2. Техническая поддержка</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <li>Telegram: @miphhhh</li>
                  <li>Время работы: 10:00 – 18:00 МСК (будни)</li>
                  <li>Ответ в течение 3 рабочих суток</li>
                </ul>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Параметр</th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Бесплатный доступ</th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Подписка (99 руб./мес)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">Задачи</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">15</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">безлимит</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">Заметки</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">15</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">безлимит</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">Размер вложения</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">до 10 МБ</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">до 150 МБ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5 - Payment */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                5. Оплата и продление
              </h2>
            </div>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <li>5.1. Подписка стоит 99 рублей за 1 месяц.</li>
              <li>5.2. Оплата через ЮKassa (одноразовое списание).</li>
              <li>5.3. Автоматического продления нет.</li>
              <li>5.4. За 3 дня до окончания подписки Исполнитель присылает уведомление на email.</li>
              <li>5.5. Чтобы продлить — нужно снова оплатить.</li>
            </ul>
          </section>

          {/* Section 6 - Cancellation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                6. Отказ от подписки и возврат денег
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>6.1. Пользователь может отменить подписку в любой момент через кнопку в Личном кабинете.</p>
              <p>6.2. При отмене:</p>
              <ul className="list-disc list-inside ml-4">
                <li>доступ к расширенным функциям сохраняется до конца оплаченного месяца;</li>
                <li>деньги за неиспользованный период не возвращаются (услуга считается оказанной полностью).</li>
              </ul>
              <p>6.3. После окончания подписки (или отмены) Пользователь переводится на бесплатный тариф с правилом «только чтение»:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Все заметки и задачи остаются видны, но редактировать и создавать новые нельзя.</li>
                <li>Чтобы снова создавать заметки/задачи — нужно уменьшить их количество до 15 (удалить лишние).</li>
                <li>Файлы, загруженные сверх 10 МБ, остаются доступны для просмотра и скачивания.</li>
                <li>Новые файлы загружать нельзя, пока общий объем не вернется в лимит 10 МБ.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 - Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                7. Ответственность
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>7.1. Сервис предоставляется «как есть» (AS IS).</p>
              <p>7.2. Исполнитель не отвечает за:</p>
              <ul className="list-disc list-inside ml-4">
                <li>прямые или косвенные убытки;</li>
                <li>потерю данных;</li>
                <li>сбои хостинга, провайдеров, DDoS-атаки;</li>
                <li>невозможность использовать Сервис.</li>
              </ul>
              <p>7.3. При доказанной вине Исполнителя — ответственность ограничена стоимостью неоказанной подписки за текущий месяц.</p>
            </div>
          </section>

          {/* Section 8 - Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                8. Персональные данные и конфиденциальность
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>8.1. Исполнитель обрабатывает: email, имя, IP, данные об устройстве.</p>
              <p>8.2. Цели: регистрация, уведомления, поддержка, работа Сервиса.</p>
              <p>8.3. Передача данных — только ЮKassa (для платежей).</p>
              <p>8.4. Полные условия — в Политике конфиденциальности (отдельный документ на сайте).</p>
            </div>
          </section>

          {/* Section 9 - Blocking */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Trash2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                9. Блокировка и расторжение
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">9.1. Исполнитель может заблокировать доступ при: взломе, скрапинге, вредоносных действиях; нарушении условий Оферты.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                10. Реквизиты
              </h2>
            </div>
            <div className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
              <p>Самозанятый Савкин Михаил Григорьевич</p>
              <p>ИНН: __________</p>
              <p>Адрес регистрации: __________</p>
              <p>Telegram: @miphhhh</p>
              <p>Email: __________</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Edit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                11. Изменение условий Оферты
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>11.1. Исполнитель меняет условия в одностороннем порядке.</p>
              <p>11.2. Уведомление об изменениях приходит на email за 14 дней.</p>
              <p>11.3. Если Пользователь не согласен — он отменяет подписку (п. 6.1). Продолжение использования после 14 дней = согласие с изменениями.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-2">
                <Gavel className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                12. Применимое право и споры
              </h2>
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>12.1. Право РФ.</p>
              <p>12.2. Споры — по месту нахождения Исполнителя (Санкт-Петербург) после претензии (ответ — 10 рабочих дней).</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
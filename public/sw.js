self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: 'МойБонч',
      body: event.data.text(),
    };
  }

  const { title, body, icon, badge, tag, requireInteraction } = notificationData;

  const options = {
    body: body || 'У вас новое уведомление',
    icon: icon || '/favicon.ico',
    badge: badge || '/favicon.ico',
    tag: tag || 'notification',
    requireInteraction: requireInteraction || false,
    data: notificationData,
    actions: [
      {
        action: 'open',
        title: 'Открыть',
      },
      {
        action: 'close',
        title: 'Закрыть',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title || 'МойБонч', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);

  event.notification.close();

  const data = event.notification.data || {};
  let url = data.url || '/';

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed');

  event.waitUntil(
    fetch('/api/notifications/resubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: event.newSubscription ? event.newSubscription.toJSON() : null,
      }),
    })
  );
});
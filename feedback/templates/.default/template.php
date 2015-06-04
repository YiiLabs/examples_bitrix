<div class="feed_form">
    <a class="close_popup" href="#">X</a>
    <h2>Напишите нам!</h2>
    <form action="/" method="POST">
        <label class="form_label " for="feed_name">Имя Отчество</label>
        <input class="feed_form_text validate" type="text" name="name" id="feed_name">
        <label class="form_label" for="feed_email">E-mail</label>
        <input class="feed_form_text validate" type="text" name="email" id="feed_email">
        <label class="form_label" for="feed_phone">Телефон</label>
        <input class="feed_form_text validate" type="text" name="phone" id="feed_phone">
        <label class="form_label" for="feed_company">Компания</label>
        <input class="feed_form_text" type="text" name="company" id="feed_company">
        <label class="form_label" for="feed_message">Ваше сообщение</label>
        <textarea class="feed_form_textarea validate" name="message" id="feed_message"></textarea>
        <input class="feed_form_submit" type="submit" value="Отправить">
    </form>
</div>

<div id="feed_form_success" class="feed_form_success" style="display: none;">
    <a href="#" class="close_popup">X</a>
    <h2>Спасибо за обращение!</h2>
    <p>В ближайшее время с Вами свяжется наш специалист!</p>
</div>
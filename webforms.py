from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField, ValidationError, TextAreaField
from wtforms.validators import DataRequired, EqualTo, Length, Email
from wtforms.widgets import TextArea, CheckboxInput
from flask_ckeditor import CKEditorField
from flask_wtf.file import FileField

class RegistrationForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    email = StringField("Email",  validators=[DataRequired("Please enter your email address."), Email("Please enter a valid email adress.")])
    password = PasswordField("Password", validators=[DataRequired()])
    password_confirm = PasswordField("Confirm Password", validators=[DataRequired(), EqualTo('password', message="Passwords don't match")])
    terms_of_service_accepted = BooleanField("I accept the terms of service", default=False, widget=CheckboxInput(), validators=[DataRequired(message="You have to accept our terms of service if you want to use facegame.")])
    data_sharing_allowed = BooleanField("I want to share my data to contribute to science", widget=CheckboxInput())
    submit = SubmitField("Submit")


class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Submit")

class PreferencesForm(FlaskForm):
    data_sharing_allowed = BooleanField("I want to share my data to contribute to science", widget=CheckboxInput(), validators=[])
    submit = SubmitField("Submit")
        
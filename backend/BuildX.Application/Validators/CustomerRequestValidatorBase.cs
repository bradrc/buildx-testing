using FluentValidation;
using BuildX.Application.Dtos;
using System.Text.RegularExpressions;

namespace BuildX.Application.Validators;

public abstract class CustomerRequestValidatorBase<T> : AbstractValidator<T> where T : CustomerRequestBase
{
    protected CustomerRequestValidatorBase()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .Must(BeAValidPhone).WithMessage("Invalid phone format. Expected: (XX) 9XXXX-XXXX or (XX) XXXX-XXXX");

        RuleFor(x => x.Address.Street)
            .NotEmpty().WithMessage("Street is required.");
        RuleFor(x => x.Address.City)
            .NotEmpty().WithMessage("City is required.");
        RuleFor(x => x.Address.State)
            .Length(2).WithMessage("State must be 2 characters (UF).");
        RuleFor(x => x.Address.ZipCode)
            .NotEmpty().WithMessage("ZipCode is required.")
            .Must(BeAValidZipCode).WithMessage("Invalid ZipCode format. Expected: 8 digits.");
    }

    private bool BeAValidPhone(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone)) return false;
        // Regex for Brazilian phone: (XX) 9XXXX-XXXX or (XX) XXXX-XXXX
        var regex = new Regex(@"^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$");
        return regex.IsMatch(phone);
    }

    private bool BeAValidZipCode(string zipCode)
    {
        if (string.IsNullOrWhiteSpace(zipCode)) return false;
        var digits = new string(zipCode.Where(char.IsDigit).ToArray());
        return digits.Length == 8;
    }
}

using FluentValidation;
using BuildX.Application.Dtos;

namespace BuildX.Application.Validators;

public class CustomerCreateRequestValidator : AbstractValidator<CustomerCreateRequest>
{
    public CustomerCreateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Document)
            .NotEmpty().WithMessage("Document (CPF/CNPJ) is required.")
            .Must(BeAValidDocument).WithMessage("Invalid CPF or CNPJ format.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.");

        RuleFor(x => x.Address.Street)
            .NotEmpty().WithMessage("Street is required.");
        RuleFor(x => x.Address.City)
            .NotEmpty().WithMessage("City is required.");
        RuleFor(x => x.Address.State)
            .Length(2).WithMessage("State must be 2 characters (UF).");
        RuleFor(x => x.Address.ZipCode)
            .NotEmpty().WithMessage("ZipCode is required.");
    }

    private bool BeAValidDocument(string document)
    {
        if (string.IsNullOrWhiteSpace(document)) return false;
        
        // Basic check for CPF (11 digits) or CNPJ (14 digits)
        // In a real scenario, we would implement the full validation algorithm
        var digitsOnly = new string(document.Where(char.IsDigit).ToArray());
        return digitsOnly.Length == 11 || digitsOnly.Length == 14;
    }
}

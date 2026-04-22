using FluentValidation;
using BuildX.Application.Dtos;

namespace BuildX.Application.Validators;

public class CustomerUpdateRequestValidator : AbstractValidator<CustomerUpdateRequest>
{
    public CustomerUpdateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

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
}

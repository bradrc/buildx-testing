using FluentValidation;
using BuildX.Application.Dtos;

namespace BuildX.Application.Validators;

public class UserPasswordUpdateRequestValidator : AbstractValidator<UserPasswordUpdateRequest>
{
    public UserPasswordUpdateRequestValidator()
    {
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
    }
}
